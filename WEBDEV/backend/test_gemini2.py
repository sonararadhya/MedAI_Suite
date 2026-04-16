import os
from dotenv import load_dotenv
import google.generativeai as genai
load_dotenv(".env")
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')
sys_prompt = {"role": "user", "parts": ["You are a professional Medical HealthCare Advisor. Follow up as assistant."]}
sys_reply = {"role": "model", "parts": ["Understood. I'm ready to help!"]}
formatted_history = [sys_prompt, sys_reply]
try:
    chat = model.start_chat(history=formatted_history)
    response = chat.send_message("fever 1 day")
    print("SUCCESS: ", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
