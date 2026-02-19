from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.rag_service import query_rag
from app.api import deps
from app.models.models import ChatLog

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    language: str = "en"

@router.post("/")
async def chat_endpoint(request: ChatRequest, db: Session = Depends(deps.get_db)):
    response = query_rag(request.query, language=request.language)
    
    # Log the interaction
    db_log = ChatLog(query=request.query, response=response, source="rag-engine")
    db.add(db_log)
    db.commit()
    
    return {"response": response, "source": "rag-engine"}
