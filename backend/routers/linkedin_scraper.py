from fastapi import APIRouter
from typing import List
from models.schemas import LinkedInScrapeRequest, Lead
from services.linkedin_service import scrape_linkedin

router = APIRouter(prefix="/api/linkedin", tags=["linkedin"])
last_leads = []

@router.post("/scrape", response_model=List[Lead])
async def scrape(req: LinkedInScrapeRequest):
    global last_leads
    try:
        last_leads = scrape_linkedin(req)
        return last_leads
    except Exception as e:
        return [] # fallback handled in service

@router.get("/leads", response_model=List[Lead])
async def get_leads():
    return last_leads
