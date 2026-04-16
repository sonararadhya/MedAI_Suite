# 🩺 MedAI Suite — Python Desktop (Legacy)

This is the standalone desktop version of the MedAI diagnostic tool, built with Python and Tkinter. It provides a quick, offline-capable interface for symptom-based health condition prediction.

---

## 🌟 Description

The Python version of MedAI Suite is a smart healthcare assistant that allows users to interact in natural language, input symptoms, and receive likely health condition predictions. It uses **Tkinter** for the graphical user interface.

---

## 📋 Features

- 🤖 **Interactive GUI**: Simple desktop interface built with Tkinter.
- 🩺 **Symptom Prediction**: Uses a decision-tree based logic for disease prediction.
- 🧠 **GPT-Powered Advisor**: Local integration for natural language health guidance.
- 📊 **Quick Training**: Uses processed CSV data for instant matching.

---

## 🛠️ Technologies Used

- **Python 3.10+**
- **Tkinter** (GUI)
- **pandas** (Data processing)
- **google-generativeai** (AI Assistant)
- **Pillow** (Image handling)

---

## 🚀 Installation & Usage

### Prerequisites

- Python 3.10+ installed
- API Key for Google Gemini (configured in your environment)

### Setup

```bash
cd PYTHON
pip install -r requirements.txt
```

### Running the App

```bash
python mainWind.py
```

---

## 📂 Project Structure

```
PYTHON/
├── Data/            # Dataset files for symptoms & predictions
├── Images/          # GUI assets and interface images
├── MasterData/      # Training data resources
├── askBot.py        # Diagnosis logic
├── gptBot.py        # AI Assistant integration
└── mainWind.py      # Main application entry point
```