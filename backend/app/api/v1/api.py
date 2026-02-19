from fastapi import APIRouter
from app.api.v1.endpoints import chat, voice, history, services

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
