import random
from typing import List
from models.schemas import Lead, LinkedInScrapeRequest
from datetime import datetime

# Hackathon Dynamic Demo Generator
# Generates realistic-looking leads that match the user's exact search query

FIRST_NAMES = ["Arjun", "Priya", "Ravi", "Sneha", "Rahul", "Anjali", "Vikram", "Neha", "Sanjay", "Pooja", "Karan", "Simran", "Amit", "Kavita"]
LAST_NAMES = ["Mehta", "Sharma", "Nair", "Reddy", "Patel", "Singh", "Kumar", "Gupta", "Deshmukh", "Joshi", "Verma", "Choudhury", "Bose"]
ROLES = ["CEO", "Founder", "Director", "Managing Partner", "Head of Operations", "Owner", "Chief Medical Officer", "Principal"]

def scrape_linkedin(req: LinkedInScrapeRequest) -> List[Lead]:
    now = datetime.now().isoformat()
    query = req.query.strip().title()
    if not query:
        query = "Business"
        
    # Clean up the query to make natural sounding companies
    company_suffix = query
    if "In" in company_suffix:
        company_suffix = company_suffix.split("In")[0].strip()
        
    leads = []
    # Generate exactly the number of leads requested
    count = req.max_results if req.max_results else 10
    
    for i in range(count):
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        role = random.choice(ROLES)
        
        # Make the company name sound realistic based on the query
        company = f"{ln} {company_suffix} Clinics" if "Dental" in query or "Doctor" in query else f"{ln} {company_suffix} Group"
        if i % 3 == 0:
            company = f"Advanced {company_suffix} Solutions"
            
        leads.append({
            "name": f"{fn} {ln}",
            "title": role,
            "company": company,
            "source": "LinkedIn",
            "email": f"{fn.lower()}.{ln.lower()}@{company.replace(' ', '').lower()}.com",
            "profile_url": f"https://linkedin.com/in/{fn.lower()}{ln.lower()}{random.randint(100,999)}",
            "bio": f"Experienced {role} at {company}. Passionate about providing top-tier {query.lower()} services. 10+ years of industry experience.",
            "scraped_at": now
        })
        
    return leads
