import customtkinter as ctk
from PIL import Image
import os
from dotenv import load_dotenv
from chatbot import ChatBotFrame
from report_analyzer import ReportAnalyzerFrame
from diet_planner import DietPlannerFrame

load_dotenv()

class MedAISuiteApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        self.title("MedAI Suite - Healthcare Intelligence")
        self.geometry("1100x700")
        self.configure(fg_color="#1a1a2e") # Dark background
        
        # Grid layout (1x2)
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        
        # Theme colors
        self.gold_color = "#d4af37"
        self.purple_color = "#9b5de5"
        self.dark_bg = "#1a1a2e"
        self.panel_bg = "#16213e"
        
        # Load Images
        image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Images")
        try:
            self.logo_image = ctk.CTkImage(Image.open(os.path.join(image_path, "logo.png")), size=(120, 120))
        except:
            self.logo_image = None
        
        # --- Sidebar ---
        self.sidebar_frame = ctk.CTkFrame(self, width=250, corner_radius=0, fg_color=self.panel_bg)
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(5, weight=1)
        
        if self.logo_image:
            self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="", image=self.logo_image)
            self.logo_label.grid(row=0, column=0, padx=20, pady=(40, 10))
        
        self.title_label = ctk.CTkLabel(self.sidebar_frame, text="MedAI Suite", font=ctk.CTkFont(size=26, weight="bold"), text_color=self.gold_color)
        self.title_label.grid(row=1, column=0, padx=20, pady=(0, 40))
        
        self.btn_chatbot = ctk.CTkButton(self.sidebar_frame, text="Disease Diagnosis", fg_color="transparent", 
                                         text_color="white", hover_color=self.purple_color, font=ctk.CTkFont(size=16, weight="bold"),
                                         command=self.show_chatbot, height=40)
        self.btn_chatbot.grid(row=2, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_report = ctk.CTkButton(self.sidebar_frame, text="Report Analyzer", fg_color="transparent", 
                                         text_color="white", hover_color=self.purple_color, font=ctk.CTkFont(size=16, weight="bold"),
                                         command=self.show_report, height=40)
        self.btn_report.grid(row=3, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_diet = ctk.CTkButton(self.sidebar_frame, text="Diet Planner", fg_color="transparent", 
                                         text_color="white", hover_color=self.purple_color, font=ctk.CTkFont(size=16, weight="bold"),
                                         command=self.show_diet, height=40)
        self.btn_diet.grid(row=4, column=0, padx=20, pady=10, sticky="ew")
        
        # --- Main Content Area ---
        self.main_frame = ctk.CTkFrame(self, corner_radius=0, fg_color=self.dark_bg)
        self.main_frame.grid(row=0, column=1, sticky="nsew")
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        
        # Initialize Frames
        self.chatbot_frame = ChatBotFrame(self.main_frame, self)
        self.report_frame = ReportAnalyzerFrame(self.main_frame, self)
        self.diet_frame = DietPlannerFrame(self.main_frame, self)
        
        self.frames = {
            "chatbot": self.chatbot_frame,
            "report": self.report_frame,
            "diet": self.diet_frame
        }
        
        self.show_chatbot()
        
    def select_button(self, btn_name):
        self.btn_chatbot.configure(fg_color="transparent")
        self.btn_report.configure(fg_color="transparent")
        self.btn_diet.configure(fg_color="transparent")
        
        if btn_name == "chatbot":
            self.btn_chatbot.configure(fg_color=self.purple_color)
        elif btn_name == "report":
            self.btn_report.configure(fg_color=self.purple_color)
        elif btn_name == "diet":
            self.btn_diet.configure(fg_color=self.purple_color)

    def show_frame(self, name):
        for frame in self.frames.values():
            frame.grid_forget()
        self.frames[name].grid(row=0, column=0, sticky="nsew")
        self.select_button(name)

    def show_chatbot(self):
        self.show_frame("chatbot")
        
    def show_report(self):
        self.show_frame("report")
        
    def show_diet(self):
        self.show_frame("diet")

if __name__ == "__main__":
    app = MedAISuiteApp()
    app.mainloop()
