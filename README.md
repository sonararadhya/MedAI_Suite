# 🩺 Healthcare Chatbot

An intelligent desktop-based Python application that assists users in identifying potential health conditions based on their symptoms using ML and NLP.

---

## 🌟 Description

Healthcare_Chatbot is a smart healthcare assistant that allows users to interact in natural language, input symptoms, and receive likely health condition predictions along with helpful guidance. The system integrates machine learning models with custom logic and optionally OpenAI GPT-powered interaction to enhance response quality. It uses **Tkinter** for GUI and standard Python libraries for data processing. 

---

## 📋 Features

- 🤖 Interactive chatbot interface  
- 🩺 Symptom-based health condition prediction  
- 🧠 Optional GPT-powered natural language enhancement  
- 📊 Integration with Decision Tree and SVM classifiers  
- 🖥️ Desktop GUI built with Tkinter  
- 📂 Easy-to-extend project structure :contentReference[oaicite:2]{index=2}

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Python | Core language |
| Tkinter | GUI |
| pandas, numpy | Data handling |
| scikit-learn | Machine Learning |
| OpenAI API (optional) | GPT-based responses |
| Pillow | Image handling |

---

## 🚀 Installation

### Prerequisites

- Python 3.7+ installed  
- pip available  
- An OpenAI API key (if using GPT features)

### Clone & Setup

```bash
git clone https://github.com/sonararadhya/Healthcare_Chatbot.git
cd Healthcare_Chatbot
pip install -r requirements.txt


Environment Setup (OpenAI)

⚡ Windows:

set OPENAI_API_KEY=your_api_key_here

⚡ macOS/Linux:

export OPENAI_API_KEY=your_api_key_here


Running the Chatbot

Launch the application:

python mainWind.py

Healthcare_Chatbot/
│
├── Data/                    # Dataset files for symptoms & predictions
├── Images/                  # GUI assets and interface images
├── MasterData/              # ML training data / model resources
│
├── about.py                 # About window UI module
├── askBot.py                # User query handling logic
├── bot.py                   # Core chatbot engine
├── bot.py~                  # Backup file
├── bot1.png                 # Bot image asset
├── gptBot.py                # GPT integration module
├── gptBot.py~               # Backup file
├── mainWind.py              # Main application entry point
│
├── .gitignore               # Git ignored files configuration
└── README.md                # Project documentation

---
*📝 Last maintained: April 13, 2026 at 03:56 UTC*