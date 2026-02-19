@echo off
cd backend
echo Starting JusticeVoice Backend...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
