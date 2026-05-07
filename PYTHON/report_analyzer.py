import customtkinter as ctk
from tkinter import filedialog
import os
import google.generativeai as genai
import threading

class ReportAnalyzerFrame(ctk.CTkFrame):
    def __init__(self, master, app_instance):
        super().__init__(master, fg_color="transparent")
        self.app = app_instance
        
        self.grid_rowconfigure(2, weight=1)
        self.grid_columnconfigure(0, weight=1)
        
        # Setup Gemini
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # UI Elements
        self.header = ctk.CTkLabel(self, text="AI Medical Report Analyzer", font=ctk.CTkFont(size=24, weight="bold"), text_color=self.app.gold_color)
        self.header.grid(row=0, column=0, pady=(20, 10))
        
        self.controls_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.controls_frame.grid(row=1, column=0, pady=10)
        
        self.upload_btn = ctk.CTkButton(self.controls_frame, text="Upload Report (PDF/Image)", font=ctk.CTkFont(size=14, weight="bold"), fg_color=self.app.purple_color, hover_color=self.app.gold_color, command=self.upload_file)
        self.upload_btn.grid(row=0, column=0, padx=10)
        
        self.file_label = ctk.CTkLabel(self.controls_frame, text="No file selected", font=ctk.CTkFont(size=12))
        self.file_label.grid(row=0, column=1, padx=10)
        
        self.result_box = ctk.CTkTextbox(self, font=ctk.CTkFont(size=14), fg_color="#1e1e2e", text_color="white", wrap="word")
        self.result_box.grid(row=2, column=0, padx=20, pady=10, sticky="nsew")
        
        self.selected_file = None

    def upload_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF & Images", "*.pdf *.png *.jpg *.jpeg")])
        if file_path:
            self.selected_file = file_path
            self.file_label.configure(text=os.path.basename(file_path))
            self.result_box.delete("1.0", "end")
            self.result_box.insert("end", "File selected. Analyzing with AI... Please wait.\n")
            threading.Thread(target=self.analyze_report).start()

    def analyze_report(self):
        try:
            sample_file = genai.upload_file(path=self.selected_file)
            
            prompt = """
            You are an expert AI Medical Analyst. Analyze the attached medical report (Blood report, X-ray, MRI summary, or ECG).
            Please provide:
            1. **Summary in Simple Language**: What does this report mean?
            2. **Risk Highlighting**: Any abnormal values or areas of concern.
            3. **Trend / Status**: Is the patient's condition stable, improving, or at risk?
            4. **Doctor Recommendation**: What type of specialist should the patient see?
            """
            
            response = self.gemini_model.generate_content([prompt, sample_file])
            
            self.result_box.delete("1.0", "end")
            self.result_box.insert("end", response.text)
            
        except Exception as e:
            self.result_box.delete("1.0", "end")
            self.result_box.insert("end", f"Error analyzing report: {str(e)}")
