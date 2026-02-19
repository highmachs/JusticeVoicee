from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.api import voice, geo
from app.db.base import Base
from app.db.session import engine
from app.models.models import Incident, ChatLog

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=True  # Simplify debugging in hackathon mode
)

# Set all CORS enabled origins (Hackathon mode: allow all)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(voice.router, prefix="/api/voice", tags=["Voice Guidance"])
app.include_router(geo.router, prefix="/api/geo", tags=["Geo Directory"])

@app.get("/")
def root():
    return {"message": "Welcome to JusticeVoice API", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
