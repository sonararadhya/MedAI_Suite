from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import math
from dotenv import load_dotenv
import google.generativeai as genai
import csv
import pandas as pd
from typing import List, Dict
from collections import Counter

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base_dir = os.path.dirname(os.path.abspath(__file__))

# ─── Load Disease Knowledge Base ──────────────────────────────────────
disease_profiles = {}
features = []
symptom_idf = {}   # Inverse Document Frequency per symptom
description_dict = {}

print("Loading disease knowledge base...")
try:
    data_path = os.path.join(base_dir, '..', 'Data', 'Training.csv')
    df = pd.read_csv(data_path)
    features = [c for c in df.columns if c != 'prognosis']

    reduced = df.groupby('prognosis').max()
    total_diseases = len(reduced)

    # Build profiles
    for disease, row in reduced.iterrows():
        active = [features[i] for i, val in enumerate(row) if val == 1]
        disease_profiles[disease] = set(active)

    # Compute IDF: rare symptoms get higher weight
    symptom_doc_count = Counter()
    for syms in disease_profiles.values():
        for s in syms:
            symptom_doc_count[s] += 1

    for symptom, count in symptom_doc_count.items():
        symptom_idf[symptom] = math.log(total_diseases / count) + 1.0

    print(f"Loaded {total_diseases} diseases, {len(features)} features, IDF computed.")
except Exception as e:
    print(f"Error loading disease profiles: {e}")

# ─── Load Precautions ────────────────────────────────────────────────
precaution_dict = {}
try:
    with open(os.path.join(base_dir, '..', 'MasterData', 'symptom_precaution.csv')) as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 5:
                precaution_dict[row[0].strip()] = [x.strip() for x in row[1:5] if x.strip()]
except:
    pass

# ─── Load Descriptions ───────────────────────────────────────────────
try:
    with open(os.path.join(base_dir, '..', 'MasterData', 'symptom_Description.csv')) as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 2:
                description_dict[row[0].strip()] = row[1].strip()
except:
    pass

# ─── Models ──────────────────────────────────────────────────────────
class DiagnoseRequest(BaseModel):
    symptoms: List[str]
    days: int

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


@app.get("/api/symptoms")
def get_symptoms():
    if not features:
        return {"symptoms": []}
    return {"symptoms": features}


@app.post("/api/diagnose")
def diagnose(request: DiagnoseRequest):
    """
    TF-IDF Weighted Symptom Matching Engine.
    
    For each disease:
      1. Find overlapping symptoms with user input.
      2. Weight each overlapping symptom by its IDF (rarer symptoms count more).
      3. Normalize by the disease's total IDF weight (so diseases with fewer 
         symptoms that are mostly matched rank higher).
      4. Apply a coverage bonus: if user provided 3 symptoms and all 3 match,
         that disease gets a significant boost.
    """
    input_syms = set(request.symptoms)
    if not input_syms or not disease_profiles:
        return {"predictions": [{"disease": "Unable to determine", "probability": 0, "precautions": [], "description": ""}]}

    scores = []
    for disease, syms_set in disease_profiles.items():
        overlap = input_syms.intersection(syms_set)
        if not overlap:
            continue

        # IDF-weighted overlap
        overlap_weight = sum(symptom_idf.get(s, 1.0) for s in overlap)
        disease_total_weight = sum(symptom_idf.get(s, 1.0) for s in syms_set)
        input_weight = sum(symptom_idf.get(s, 1.0) for s in input_syms)

        # recall: how much of the user's symptoms does this disease explain?
        recall = overlap_weight / input_weight if input_weight > 0 else 0

        # precision: what fraction of the disease's symptoms has the user provided?
        precision = overlap_weight / disease_total_weight if disease_total_weight > 0 else 0

        # Penalize if user symptoms are MISSING from disease profile
        # e.g. user says "cough" but Allergy doesn't have "cough" -> strong penalty
        missed_syms = input_syms - syms_set
        missed_weight = sum(symptom_idf.get(s, 1.0) for s in missed_syms)
        miss_penalty = 1.0 - (0.7 * (missed_weight / input_weight)) if input_weight > 0 else 1.0
        miss_penalty = max(miss_penalty, 0.05)

        # Balanced F-beta score (beta=1.2, slightly favoring recall)
        beta = 1.2
        if recall + precision > 0:
            score = ((1 + beta**2) * recall * precision) / ((beta**2 * precision) + recall)
        else:
            score = 0

        score *= miss_penalty
        scores.append((disease, score))

    scores.sort(key=lambda x: x[1], reverse=True)

    # Normalize top results to percentage scale
    if scores:
        max_score = scores[0][1]
        if max_score > 0:
            normalized = [(d, (s / max_score) * 100) for d, s in scores]
        else:
            normalized = [(d, 0) for d, s in scores]
    else:
        normalized = []

    top_5 = normalized[:5]
    results = []
    for d, prob in top_5:
        results.append({
            "disease": d,
            "probability": round(prob, 1),
            "precautions": precaution_dict.get(d, []),
            "description": description_dict.get(d, "")
        })

    if not results:
        return {"predictions": [{"disease": "No matching conditions found", "probability": 0, "precautions": [], "description": ""}]}

    return {"predictions": results}


@app.post("/api/chat")
def chat_with_gemini(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not set.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-flash-latest')

    sys_prompt = {"role": "user", "parts": ["You are a professional Medical HealthCare Advisor. Provide helpful, empathetic, non-diagnostic medical guidance. Always recommend consulting a doctor for serious concerns."]}
    sys_reply = {"role": "model", "parts": ["Understood. I will provide helpful medical guidance while recommending professional consultation for serious concerns."]}

    formatted_history = [sys_prompt, sys_reply]
    for hm in request.history:
        role = "user" if hm.get("role") == "user" else "model"
        formatted_history.append({"role": role, "parts": [hm.get("content")]})

    try:
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(request.message)
        return {"role": "bot", "content": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
