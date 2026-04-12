# 🩺 Healthcare Chatbot

An intelligent desktop-based Python application that assists users in identifying potential health conditions based on their symptoms using ML and NLP.

---

## 🌟 Description

Healthcare_Chatbot is a smart healthcare assistant that facilitates users to interact in natural language, input symptoms, and receive likely health condition predictions along with helpful guidance. The system integrates machine learning models with custom logic and optionally OpenAI GPT-powered interaction to enhance response quality. It employs **Tkinter** for GUI and standard Python libraries for data processing. 

---

## 📋 Incorporates

- 🤖 Interactive chatbot interface  
- 🩺 Symptom-based health condition prediction  
- 🧠 Optional GPT-powered natural language enhancement  
- 📊 Integration with Decision Tree and SVM classifiers  
- 🖥️ Desktop GUI crafted with Tkinter  
- 📂 Straightforward-to-extend project structure :contentGuide[oaicite:2]{index=2}

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
- An OpenAI API key (if using GPT incorporates)

### Clone & Pguides

```bash
git clone https://github.com/sonararadhya/Healthcare_Chatbot.git
cd Healthcare_Chatbot
pip install -r requirements.txt


Environment Pguides (OpenAI)

⚡ Windows:

set OPENAI_API_KEY=your_api_key_here

⚡ macOS/Linux:

export OPENAI_API_KEY=your_api_key_here


Running the Chatbot

Launch the applicationlicationlicationlicationlication:

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
├── mainWind.py              # Main applicationlicationlicationlicationlication entry point
│
├── .gitignore               # Git ignored files pguides
└── README.md                # Project guide

---
*📝 Last maintained: April 12, 2026 at 08:52 UTC*