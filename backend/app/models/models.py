from sqlalchemy import Column, Integer, String, Text, DateTime, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class Incident(Base):
    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text, nullable=False)
    incident_type = Column(String, index=True)  # e.g., "Domestic Violence", "Stalking"
    location_lat = Column(String, nullable=True)
    location_long = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="Open")  # Open, Resolved, Reported

class ChatLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    source = Column(String)  # RAG, Rule-Based, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
