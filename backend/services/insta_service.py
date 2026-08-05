from typing import List
from models.schemas import Lead, InstaScrapeRequest
from datetime import datetime

# DEMO FALLBACK
def scrape_instagram(req: InstaScrapeRequest) -> List[Lead]:
    now = datetime.now().isoformat()
    return [
      {
        "name": "Kavya Events",
        "title": "Event Planner",
        "company": "Kavya Events HYD",
        "source": "Instagram",
        "email": None,
        "profile_url": "https://instagram.com/kavyaevents",
        "bio": "Hyderabad's top wedding and corporate event planner. 500+ events.",
        "scraped_at": now
      },
      {
        "name": "FitZone Gym",
        "title": "Owner",
        "company": "FitZone Fitness Center",
        "source": "Instagram",
        "email": None,
        "profile_url": "https://instagram.com/fitzonehyd",
        "bio": "Premium gym in Banjara Hills. Personal training, nutrition coaching.",
        "scraped_at": now
      }
    ]
