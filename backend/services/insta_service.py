import random
from typing import List
from models.schemas import Lead, InstaScrapeRequest
from datetime import datetime

# Hackathon Dynamic Demo Generator
# Generates realistic-looking Instagram leads that match the user's exact search query

FIRST_NAMES = ["Kavya", "Rohit", "Sneha", "Aditya", "Priya", "Rahul", "Meera", "Varun", "Shruti", "Rishi"]
LAST_NAMES = ["Events", "Photography", "Designs", "Creations", "Studio", "Boutique", "Catering", "Visuals", "Decor", "Arts"]

def scrape_instagram(req: InstaScrapeRequest) -> List[Lead]:
    now = datetime.now().isoformat()
    query = req.query.strip().title()
    if not query:
        query = "Lifestyle"
        
    company_suffix = query
    if "In" in company_suffix:
        company_suffix = company_suffix.split("In")[0].strip()
        
    leads = []
    count = req.max_posts if req.max_posts else 10
    
    for i in range(count):
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        
        company = f"{fn} {company_suffix} {ln}"
        if i % 2 == 0:
            company = f"The {company_suffix} {ln}"
            
        handle = company.replace(" ", "").lower()
            
        leads.append({
            "name": f"{fn}",
            "title": "Creator / Owner",
            "company": company,
            "source": "Instagram",
            "email": f"hello@{handle}.in",
            "profile_url": f"https://instagram.com/{handle}{random.randint(1,99)}",
            "bio": f"Premium {query.lower()} services. DM for collaborations and bookings! ✨📍 India",
            "scraped_at": now
        })
        
    return leads
