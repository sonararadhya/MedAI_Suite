from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import csv
import joblib
from dotenv import load_dotenv
import google.generativeai as genai
from typing import List, Dict
import tempfile

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

# ─── Load Model and Data ──────────────────────────────────────
print("Loading model and knowledge base...")
try:
    model_path = os.path.join(base_dir, 'Model', 'rf_model.pkl')
    model_data = joblib.load(model_path)
    clf = model_data['model']
    le = model_data['label_encoder']
    features = model_data['features']
except Exception as e:
    print(f"Error loading model: {e}")
    features = []

precaution_dict = {}
try:
    with open(os.path.join(base_dir, 'MasterData', 'symptom_precaution.csv')) as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 5:
                precaution_dict[row[0].strip()] = [x.strip() for x in row[1:5] if x.strip()]
except: pass

description_dict = {}
try:
    with open(os.path.join(base_dir, 'MasterData', 'symptom_Description.csv')) as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 2:
                description_dict[row[0].strip()] = row[1].strip()
except: pass

class DiagnoseRequest(BaseModel):
    symptoms: List[str]
    days: int

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

@app.get("/api/symptoms")
def get_symptoms():
    return {"symptoms": features}

@app.post("/api/diagnose")
def diagnose(request: DiagnoseRequest):
    input_syms = set(request.symptoms)
    if not input_syms or not features:
        return {"predictions": [{"disease": "Unable to determine", "probability": 0, "precautions": [], "description": ""}]}
    
    input_vector = [0] * len(features)
    for i, f in enumerate(features):
        if f in input_syms:
            input_vector[i] = 1
            
    # Predict probabilities
    probs = clf.predict_proba([input_vector])[0]
    
    # Get top 5
    top_indices = probs.argsort()[-5:][::-1]
    
    results = []
    for idx in top_indices:
        prob = probs[idx]
        if prob > 0:
            disease = le.inverse_transform([idx])[0]
            results.append({
                "disease": disease,
                "probability": round(prob * 100, 1),
                "precautions": precaution_dict.get(disease, []),
                "description": description_dict.get(disease, "")
            })
            
    if not results:
        return {"predictions": [{"disease": "No matching conditions found", "probability": 0, "precautions": [], "description": ""}]}

    return {"predictions": results}

@app.post("/api/analyze_report")
async def analyze_report(file: UploadFile = File(...)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: raise HTTPException(status_code=500, detail="Gemini API Key missing")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
        
    try:
        sample_file = genai.upload_file(path=tmp_path)
        prompt = """
        You are an expert AI Medical Analyst. Analyze the attached medical report (Blood report, X-ray, MRI summary, or ECG).
        Please provide:
        1. **Summary in Simple Language**: What does this report mean?
        2. **Risk Highlighting**: Any abnormal values or areas of concern.
        3. **Trend / Status**: Is the patient's condition stable, improving, or at risk?
        4. **Doctor Recommendation**: What type of specialist should the patient see?
        """
        response = model.generate_content([prompt, sample_file])
        return {"analysis": response.text}
    finally:
        os.unlink(tmp_path)

@app.post("/api/diet_plan")
async def diet_plan(conditions: str = Form(""), allergies: str = Form(""), file: UploadFile = File(None)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: raise HTTPException(status_code=500, detail="Gemini API Key missing")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are an expert AI Dietitian. Create a personalized diet plan based on the following:
    Conditions: {conditions if conditions else 'None specified'}
    Allergies: {allergies if allergies else 'None specified'}
    """
    
    inputs = [prompt]
    tmp_path = None
    
    if file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        try:
            sample_file = genai.upload_file(path=tmp_path)
            inputs.append(sample_file)
            inputs[0] += "\nI have also attached a photo of my meal. Please estimate its calories and tell me if it aligns with my diet plan."
        except Exception as e:
            pass

    try:
        response = model.generate_content(inputs)
        return {"plan": response.text}
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.post("/api/chat")
def chat_with_gemini(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: raise HTTPException(status_code=500, detail="Gemini API Key missing")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    sys_prompt = {"role": "user", "parts": ["You are a professional Medical HealthCare Advisor. Provide helpful, empathetic, non-diagnostic medical guidance."]}
    sys_reply = {"role": "model", "parts": ["Understood. I will provide helpful medical guidance."]}

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
