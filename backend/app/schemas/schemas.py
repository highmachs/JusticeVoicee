from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# --- Incident Schemas ---
class IncidentBase(BaseModel):
    description: str
    incident_type: Optional[str] = None
    location_lat: Optional[str] = None
    location_long: Optional[str] = None
    status: Optional[str] = "Open"

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- ChatLog Schemas ---
class ChatLogBase(BaseModel):
    query: str
    response: str
    source: Optional[str] = "RAG"

class ChatLogCreate(ChatLogBase):
    pass

class ChatLog(ChatLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
