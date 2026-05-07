import customtkinter as ctk
import os
import joblib
import pandas as pd
import csv
import json
import google.generativeai as genai
from PIL import Image

class ChatBotFrame(ctk.CTkFrame):
    def __init__(self, master, app_instance):
        super().__init__(master, fg_color="transparent")
        self.app = app_instance
        
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)
        
        # Load Model and Encoders
        base_dir = os.path.dirname(os.path.realpath(__file__))
        model_path = os.path.join(base_dir, 'Model', 'rf_model.pkl')
        self.model_data = joblib.load(model_path)
        self.clf = self.model_data['model']
        self.le = self.model_data['label_encoder']
        self.features = self.model_data['features']
        
        # Load Dictionaries
        self.description_list = {}
        self.precautionDictionary = {}
        self.getDescription(os.path.join(base_dir, 'MasterData', 'symptom_Description.csv'))
        self.getprecautionDict(os.path.join(base_dir, 'MasterData', 'symptom_precaution.csv'))
        
        # Setup Gemini
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # UI Elements
        self.header = ctk.CTkLabel(self, text="AI Disease Diagnosis", font=ctk.CTkFont(size=24, weight="bold"), text_color=self.app.gold_color)
        self.header.grid(row=0, column=0, pady=(20, 10))
        
        self.chat_box = ctk.CTkTextbox(self, font=ctk.CTkFont(size=14), fg_color="#1e1e2e", text_color="white", state="disabled")
        self.chat_box.grid(row=1, column=0, padx=20, pady=10, sticky="nsew")
        
        self.input_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.input_frame.grid(row=2, column=0, padx=20, pady=(10, 20), sticky="ew")
        self.input_frame.grid_columnconfigure(0, weight=1)
        
        self.entry = ctk.CTkEntry(self.input_frame, placeholder_text="Type your symptoms and how many days (e.g. 'I have headache and skin rash for 3 days')...", font=ctk.CTkFont(size=14), height=40)
        self.entry.grid(row=0, column=0, padx=(0, 10), sticky="ew")
        self.entry.bind("<Return>", lambda e: self.send_message())
        
        self.send_btn = ctk.CTkButton(self.input_frame, text="Send", font=ctk.CTkFont(size=14, weight="bold"), fg_color=self.app.purple_color, hover_color=self.app.gold_color, width=100, height=40, command=self.send_message)
        self.send_btn.grid(row=0, column=1)
        
        self.append_message("Bot", "Hello! Please describe your symptoms and how many days you've been experiencing them.")

    def getDescription(self, path):
        try:
            with open(path) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                for row in csv_reader:
                    if len(row) >= 2:
                        self.description_list[row[0].strip()] = row[1].strip()
        except:
            pass

    def getprecautionDict(self, path):
        try:
            with open(path) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter=',')
                for row in csv_reader:
                    if len(row) >= 5:
                        self.precautionDictionary[row[0].strip()] = [x.strip() for x in row[1:5]]
        except:
            pass

    def append_message(self, sender, text):
        self.chat_box.configure(state="normal")
        if sender == "User":
            self.chat_box.insert("end", f"\nYou: {text}\n", "user")
        else:
            self.chat_box.insert("end", f"\nHealix AI: {text}\n", "bot")
        self.chat_box.configure(state="disabled")
        self.chat_box.see("end")

    def send_message(self):
        msg = self.entry.get().strip()
        if not msg:
            return
        
        self.entry.delete(0, "end")
        self.append_message("User", msg)
        
        # Run in a daemon thread to prevent UI freezing
        import threading
        threading.Thread(target=self._process_message, args=(msg,), daemon=True).start()

    def _process_message(self, msg):
        try:
            prompt = f"""
            You are a medical symptom extractor.
            Given the user's text: "{msg}"
            
            Extract any symptoms that are explicitly mentioned or heavily implied.
            Map them to the exact strings in this list: {self.features}
            
            Return ONLY a valid JSON list of matching strings. If none match, return [].
            Example: ["headache", "skin_rash"]
            """
            
            response = self.gemini_model.generate_content(prompt)
            raw_text = response.text.strip().replace('```json', '').replace('```', '')
            extracted_symptoms = json.loads(raw_text)
            
            if not extracted_symptoms:
                self.append_message("Bot", "I couldn't identify specific symptoms from your description. Could you be more specific?")
                return
            
            # Form vector
            input_vector = [0] * len(self.features)
            for sym in extracted_symptoms:
                if sym in self.features:
                    idx = self.features.index(sym)
                    input_vector[idx] = 1
            
            # Predict
            pred_encoded = self.clf.predict([input_vector])
            prediction = self.le.inverse_transform(pred_encoded)[0]
            
            desc = self.description_list.get(prediction, "No description available.")
            precautions = self.precautionDictionary.get(prediction, [])
            
            reply = f"Based on your symptoms ({', '.join(extracted_symptoms)}), you may have: **{prediction}**.\n\n"
            reply += f"Description: {desc}\n\n"
            if precautions:
                reply += "Precautions you should take:\n"
                for i, p in enumerate(precautions):
                    if p: reply += f"{i+1}. {p}\n"
                    
            reply += "\n*Note: This is an AI prediction. Please consult a doctor for a professional diagnosis.*"
            
            self.append_message("Bot", reply)
            
        except Exception as e:
            self.append_message("Bot", f"An error occurred while processing: {str(e)}")
