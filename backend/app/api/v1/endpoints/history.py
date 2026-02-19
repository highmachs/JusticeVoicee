from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from datetime import datetime
import os
from app.api import deps
from app.models.models import Incident, ChatLog
from app.schemas import schemas

router = APIRouter()

# --- Incidents ---
@router.post("/incidents/", response_model=schemas.Incident)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(deps.get_db)):
    db_incident = Incident(**incident.model_dump())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.get("/incidents/", response_model=List[schemas.Incident])
def read_incidents(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db)):
    incidents = db.query(Incident).offset(skip).limit(limit).all()
    return incidents

# --- Chat Logs ---
@router.post("/chat-logs/", response_model=schemas.ChatLog)
def log_chat(chat_log: schemas.ChatLogCreate, db: Session = Depends(deps.get_db)):
    db_log = ChatLog(**chat_log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.get("/chat-logs/", response_model=List[schemas.ChatLog])
def read_chat_logs(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db)):
    logs = db.query(ChatLog).offset(skip).limit(limit).all()
    return logs

@router.delete("/clear-all/", status_code=204)
def clear_history(db: Session = Depends(deps.get_db)):
    """
    Panic Button / Quick Exit support: Wipes all sensitive logs.
    """
    db.query(Incident).delete()
    db.query(ChatLog).delete()
    db.commit()
    return

@router.post("/upload", status_code=201)
async def upload_evidence(file: UploadFile = File(...)):
    """
    Simulates 'Evidence Locker' - saves files to a secure backend folder.
    In a real native app, this would be encrypted local storage.
    """
    evidence_dir = "backend/evidence_locker"
    if not os.path.exists(evidence_dir):
        os.makedirs(evidence_dir)
    
    file_path = os.path.join(evidence_dir, f"EVIDENCE_{int(datetime.now().timestamp())}_{file.filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
            
    return {"status": "securely_saved", "filename": file.filename}
