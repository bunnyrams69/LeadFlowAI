from fastapi import APIRouter, UploadFile, File
from models.schemas import ChatRequest, ChatResponse
from services.rag_service import chat

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    return chat(req)

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    return {"status": "uploaded", "filename": file.filename}
