from typing import List
from models.schemas import Lead, LinkedInScrapeRequest
from datetime import datetime

# DEMO FALLBACK
def scrape_linkedin(req: LinkedInScrapeRequest) -> List[Lead]:
    now = datetime.now().isoformat()
    return [
      {
        "name": "Arjun Mehta",
        "title": "CEO",
        "company": "Madhuvan Group",
        "source": "LinkedIn",
        "email": None,
        "profile_url": "https://linkedin.com/in/arjunmehta",
        "bio": "Real estate developer in Vadodara. 15 years in luxury residential projects.",
        "scraped_at": now
      },
      {
        "name": "Priya Sharma",
        "title": "Owner",
        "company": "DentaZen Clinic",
        "source": "LinkedIn",
        "email": None,
        "profile_url": "https://linkedin.com/in/priyasharma",
        "bio": "Dental clinic owner in Hyderabad. Focused on patient experience and digital presence.",
        "scraped_at": now
      },
      {
        "name": "Ravi Nair",
        "title": "Co-Founder",
        "company": "Eventokart",
        "source": "LinkedIn",
        "email": None,
        "profile_url": "https://linkedin.com/in/ravinair",
        "bio": "Event marketplace connecting vendors and clients across Hyderabad.",
        "scraped_at": now
      },
      {
        "name": "Sneha Reddy",
        "title": "Director",
        "company": "Sunrise Bar & Lounge",
        "source": "LinkedIn",
        "email": None,
        "profile_url": "https://linkedin.com/in/snehareddy",
        "bio": "Running Hyderabad's top rooftop lounge. Always looking for marketing innovation.",
        "scraped_at": now
      }
    ]
