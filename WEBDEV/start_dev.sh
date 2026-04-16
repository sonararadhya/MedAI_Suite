#!/bin/bash
# MedAI Suite - One-Click Development Launcher
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV="$DIR/venv/bin"

echo "══════════════════════════════════════"
echo "  MedAI Suite - Starting Servers..."
echo "══════════════════════════════════════"

echo "[1/2] Starting FastAPI Backend (port 8000)..."
"$VENV/uvicorn" app:app --reload --port 8000 --app-dir "$DIR/backend" &
BACKEND_PID=$!
sleep 2

echo "[2/2] Starting React Frontend..."
cd "$DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Backend:  http://127.0.0.1:8000"
echo "  Frontend: http://127.0.0.1:5173"
echo "  Press Ctrl+C to stop both."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
