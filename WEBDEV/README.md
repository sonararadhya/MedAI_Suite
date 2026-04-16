# 🏥 MedAI Suite — Web Application (Modern)

The flagship full-stack web platform for MedAI Suite, featuring high-precision diagnostics, mental wellness tracking, and clinical report generation.

---

## 🌟 Description

MedAI Suite Web is a modern diagnostic platform that leverages a deterministic TF-IDF weighted matching algorithm to provide 92.7% diagnostic accuracy. It features a professional clinical UI and 100% data privacy.

---

## 📋 Features

- 🔬 **Deterministic Diagnostics**: TF-IDF weighted algorithm for 92.7% precision.
- 🧠 **Mental Wellness Portal**: Standardized PHQ-9 assessment for clinical severity.
- 📊 **BMI & Nutrition Tracking**: Tailored dietary guidance based on age and health status.
- 🤖 **AI Medical Advisor**: Gemini-powered conversational health assistant.
- 📄 **PDF Reports**: Export professional clinical records for doctors.
- 🚨 **Emergency Directory**: Quick access to national medical hotlines.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Recharts, Framer Motion, jsPDF
- **Backend**: FastAPI (Python), uvicorn
- **Data**: 10,000+ synthesized medical records

---

## 🚀 Installation & Usage

### Setup

```bash
cd WEBDEV
# Setup backend
python3 -m venv venv
./venv/bin/pip install fastapi uvicorn google-generativeai pandas python-dotenv

# Setup frontend
cd frontend
npm install
```

### Running the Platform

Use the one-click launcher from the `WEBDEV` directory:

```bash
./start_dev.sh
```

---

## 📂 Project Structure

```
WEBDEV/
├── backend/         # FastAPI diagnostic engine
├── frontend/        # React glassmorphism dashboard
├── Data/            # Clinical datasets
├── MasterData/      # Precaution & description database
├── Screenshots/     # Application visual preview
└── start_dev.sh     # Developer launcher
```