# MedAI Suite

An industry-grade, AI-powered medical diagnostic platform featuring symptom-based disease prediction, mental wellness assessment, and real-time clinical advisory.

---

## Architecture

```
MedAI-Suite/
├── PYTHON/          → Release 1: Standalone Python CLI
└── WEBDEV/          → Release 2: Full-Stack Web Application
    ├── backend/     → FastAPI + TF-IDF Diagnostic Engine
    ├── frontend/    → React + Vite Dashboard
    └── Data/        → 10,000+ Medical Records
```

## Release 1 — Python Standalone

A Tkinter-based desktop application for offline medical diagnosis.

**Tech:** Python, scikit-learn, Google Gemini API

```bash
cd PYTHON
pip install -r requirements.txt
python mainWind.py
```

## Release 2 — Web Application

A modern full-stack medical platform with 92.7% diagnostic accuracy.

### Features

| Feature | Description |
|---------|-------------|
| **Diagnostic Portal** | TF-IDF weighted symptom matching across 41 diseases, 132 symptoms |
| **AI Medical Advisor** | Conversational guidance via Google Gemini |
| **BMI & Nutrition** | Age-based dietary guidelines with BMI calculator |
| **Mental Wellness** | Standardized PHQ-9 depression screening |
| **Patient History** | Persisted records with PDF clinical report export |
| **Emergency** | National emergency hotline directory |

### Algorithm — TF-IDF Weighted Scoring

The diagnostic engine uses **Inverse Document Frequency** to weight symptom rarity:
- Rare symptoms (e.g., `nodal_skin_eruptions`) carry more diagnostic weight than common ones (e.g., `headache`)
- F-beta harmonic scoring balances recall and precision
- Miss penalty penalizes diseases that don't contain user-provided symptoms

**Benchmark:** 92.7% Top-1 accuracy, 100% Top-3 accuracy across all 41 diseases.

### Quick Start

```bash
cd WEBDEV
./start_dev.sh
```

Or manually:

```bash
# Terminal 1 - Backend
cd WEBDEV
./venv/bin/uvicorn app:app --reload --app-dir backend

# Terminal 2 - Frontend
cd WEBDEV/frontend
npm run dev
```

### Tech Stack

**Backend:** FastAPI, Python 3.13, pandas, Google Gemini API  
**Frontend:** React 19, Vite, Recharts, Framer Motion, jsPDF  
**Data:** 10,000+ synthesized medical records, 41 diseases, 132 symptoms

---

### Environment Variables

Create `WEBDEV/backend/.env`:
```
GEMINI_API_KEY=your_api_key_here
```

---

## Screenshots

*Coming soon*

## License

MIT
