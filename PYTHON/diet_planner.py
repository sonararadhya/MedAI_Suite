import customtkinter as ctk
from tkinter import filedialog
import os
import google.generativeai as genai
import threading

class DietPlannerFrame(ctk.CTkFrame):
    def __init__(self, master, app_instance):
        super().__init__(master, fg_color="transparent")
        self.app = app_instance
        
        self.grid_rowconfigure(2, weight=1)
        self.grid_columnconfigure(0, weight=1)
        
        # Setup Gemini
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # UI Elements
        self.header = ctk.CTkLabel(self, text="AI Diet Planner", font=ctk.CTkFont(size=24, weight="bold"), text_color=self.app.gold_color)
        self.header.grid(row=0, column=0, pady=(20, 10))
        
        self.inputs_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.inputs_frame.grid(row=1, column=0, pady=10, sticky="ew", padx=20)
        self.inputs_frame.grid_columnconfigure(1, weight=1)
        
        ctk.CTkLabel(self.inputs_frame, text="Conditions (Diabetes, BP, etc):", font=ctk.CTkFont(size=14)).grid(row=0, column=0, padx=10, pady=5, sticky="e")
        self.conditions_entry = ctk.CTkEntry(self.inputs_frame, font=ctk.CTkFont(size=14))
        self.conditions_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew")
        
        ctk.CTkLabel(self.inputs_frame, text="Allergies:", font=ctk.CTkFont(size=14)).grid(row=1, column=0, padx=10, pady=5, sticky="e")
        self.allergies_entry = ctk.CTkEntry(self.inputs_frame, font=ctk.CTkFont(size=14))
        self.allergies_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")
        
        self.upload_btn = ctk.CTkButton(self.inputs_frame, text="Upload Meal Photo (Optional)", font=ctk.CTkFont(size=14, weight="bold"), fg_color=self.app.purple_color, hover_color=self.app.gold_color, command=self.upload_file)
        self.upload_btn.grid(row=2, column=0, padx=10, pady=10)
        
        self.file_label = ctk.CTkLabel(self.inputs_frame, text="No image selected", font=ctk.CTkFont(size=12))
        self.file_label.grid(row=2, column=1, padx=10, pady=10, sticky="w")
        
        self.plan_btn = ctk.CTkButton(self.inputs_frame, text="Generate Diet Plan", font=ctk.CTkFont(size=14, weight="bold"), fg_color="#4CAF50", hover_color="#45a049", command=self.generate_plan)
        self.plan_btn.grid(row=3, column=0, columnspan=2, pady=10)
        
        self.result_box = ctk.CTkTextbox(self, font=ctk.CTkFont(size=14), fg_color="#1e1e2e", text_color="white", wrap="word")
        self.result_box.grid(row=2, column=0, padx=20, pady=10, sticky="nsew")
        
        self.selected_file = None

    def upload_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Images", "*.png *.jpg *.jpeg")])
        if file_path:
            self.selected_file = file_path
            self.file_label.configure(text=os.path.basename(file_path))

    def generate_plan(self):
        self.result_box.delete("1.0", "end")
        self.result_box.insert("end", "Generating diet plan... Please wait.\n")
        threading.Thread(target=self._run_generation).start()

    def _run_generation(self):
        conditions = self.conditions_entry.get().strip()
        allergies = self.allergies_entry.get().strip()
        
        prompt = f"""
        You are an expert AI Dietitian. Create a personalized diet plan based on the following:
        Conditions: {conditions if conditions else 'None specified'}
        Allergies: {allergies if allergies else 'None specified'}
        """
        
        inputs = [prompt]
        
        try:
            if self.selected_file:
                sample_file = genai.upload_file(path=self.selected_file)
                inputs.append(sample_file)
                prompt += "\nI have also attached a photo of my meal. Please estimate its calories and tell me if it aligns with my diet plan."
                inputs[0] = prompt
            
            response = self.gemini_model.generate_content(inputs)
            
            self.result_box.delete("1.0", "end")
            self.result_box.insert("end", response.text)
            
        except Exception as e:
            self.result_box.delete("1.0", "end")
            self.result_box.insert("end", f"Error generating plan: {str(e)}")
