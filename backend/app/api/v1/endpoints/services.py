from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from app.services.triage_service import triage_service
from app.services.directory_service import get_nearby_help
from app.services.form_service import pdf_service
from fastapi.responses import FileResponse

router = APIRouter()

# --- Triage ---
class TriageRequest(BaseModel):
    text: str

@router.post("/triage")
def triage_intent(request: TriageRequest):
    return triage_service.classify_urgency(request.text)

# --- Directory ---
class GeoRequest(BaseModel):
    lat: float
    lng: float

@router.post("/connect/nearby")
def find_help(request: GeoRequest):
    results = get_nearby_help(request.lat, request.lng)
    if not results:
        return {"message": "No centers found nearby", "results": []}
    return {"results": results}

# --- Action (Form Generation) ---
class FormRequest(BaseModel):
    victim_name: str
    respondent_name: str
    incident_details: str

@router.post("/action/generate-pdf")
def generate_form(request: FormRequest):
    try:
        file_path = pdf_service.generate_pwdva_form(
            request.victim_name, 
            request.respondent_name, 
            request.incident_details
        )
        return FileResponse(file_path, media_type='application/pdf', filename="DIR_Form.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sync/offline-data")
def get_offline_package():
    """
    Returns the critical data package for the mobile app to cache for Offline Mode.
    Includes: NGO Directory, Static Legal Q&A (triage defaults).
    """
    # 1. Directory Data
    directory_data = triage_service.classify_urgency("help") # Dummy call to load logic if needed
    from app.services.directory_service import directory_service
    
    # 2. Static Knowledge (Simplified for payload)
    static_knowledge = [
        {"q": "Helpline", "a": "Dial 181 for Women Helpline"},
        {"q": "Police", "a": "Dial 112 for Police"},
        {"q": "Dowry", "a": "Demand for dowry is illegal under Dowry Prohibition Act 1961."},
        {"q": "Violence", "a": "You are protected under PWDVA 2005. Leave immediately if unsafe."}
    ]
    
    return {
        "directory": directory_service.data,
        "static_knowledge": static_knowledge,
        "version": "1.0.0"
    }
