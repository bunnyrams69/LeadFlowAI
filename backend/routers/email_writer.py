from fastapi import APIRouter
from typing import List
from models.schemas import EmailRequest, EmailResponse
from services.email_service import write_email

router = APIRouter(prefix="/api/email", tags=["email"])

@router.post("/write", response_model=EmailResponse)
async def write(req: EmailRequest):
    return write_email(req)

@router.post("/write-bulk", response_model=List[EmailResponse])
async def write_bulk(reqs: List[EmailRequest]):
    return [write_email(r) for r in reqs]
