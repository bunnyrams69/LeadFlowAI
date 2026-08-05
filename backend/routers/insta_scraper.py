from fastapi import APIRouter
from typing import List
from models.schemas import InstaScrapeRequest, Lead
from services.insta_service import scrape_instagram

router = APIRouter(prefix="/api/instagram", tags=["instagram"])
last_leads = []

@router.post("/scrape", response_model=List[Lead])
async def scrape(req: InstaScrapeRequest):
    global last_leads
    try:
        last_leads = scrape_instagram(req)
        return last_leads
    except Exception as e:
        return []

@router.get("/leads", response_model=List[Lead])
async def get_leads():
    return last_leads
