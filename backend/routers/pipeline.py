from fastapi import APIRouter
from models.schemas import PipelineRequest, PipelineResponse, LinkedInScrapeRequest, InstaScrapeRequest, EmailRequest, PostRequest
from services.linkedin_service import scrape_linkedin
from services.insta_service import scrape_instagram
from services.email_service import write_email
from services.post_service import publish_post

router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])

@router.post("/run", response_model=PipelineResponse)
async def run_pipeline(req: PipelineRequest):
    leads = []
    if req.source.lower() == "linkedin":
        leads = scrape_linkedin(LinkedInScrapeRequest(query=req.query))
    else:
        leads = scrape_instagram(InstaScrapeRequest(query=req.query))
        
    emails = []
    for lead in leads:
        emails.append(write_email(EmailRequest(
            lead=lead, 
            product_description=req.product_description, 
            sender_name=req.sender_name
        )))
        
    post_status = "skipped"
    if req.auto_post:
        res = publish_post(PostRequest(content="Just ran a successful campaign!"))
        post_status = res.status
        
    return PipelineResponse(leads=leads, emails=emails, post_status=post_status)
