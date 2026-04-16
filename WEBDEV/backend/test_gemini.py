import sys
import traceback
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv("WEBDEV /backend/.env")

try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("No API Key")
        sys.exit(1)
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    sys_prompt = {"role": "user", "parts": ["You are a professional Medical HealthCare Advisor. Provide helpful but non-diagnostic advice. Follow up as assistant."]}
    sys_reply = {"role": "model", "parts": ["Understood. I'm ready to help!"]}
    
    formatted_history = [sys_prompt, sys_reply]
    chat = model.start_chat(history=formatted_history)
    response = chat.send_message("fever 1 day")
    print("SUCCESS: ", response.text)
except Exception as e:
    print("FAILED:")
    traceback.print_exc()
