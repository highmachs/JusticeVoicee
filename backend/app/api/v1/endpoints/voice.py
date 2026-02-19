from fastapi import APIRouter, UploadFile, File, Form, HTTPException
# from app.services.voice_service import transcribe_audio, generate_speech
from app.core.utils import validate_audio_file
import os

router = APIRouter()

@router.post("/asr")
async def asr_endpoint(file: UploadFile = File(...), lang: str = Form("hi")):
    raise HTTPException(status_code=501, detail="Endpoint not implemented in JusticeVoice")

@router.post("/tts")
async def tts_endpoint(text: str, lang: str = "hi"):
    raise HTTPException(status_code=501, detail="Endpoint not implemented in JusticeVoice")
