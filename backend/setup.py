import os

base = r"e:\lead flow\backend"

dirs = [
    "routers",
    "services",
    "models"
]

for d in dirs:
    os.makedirs(os.path.join(base, d), exist_ok=True)
    with open(os.path.join(base, d, "__init__.py"), "w") as f:
        pass

with open(os.path.join(base, "requirements.txt"), "w") as f:
    f.write("""fastapi
uvicorn
python-dotenv
pydantic
python-multipart
anthropic
requests
aiofiles
""")

schemas_content = '''from pydantic import BaseModel
from typing import Optional, List

class LinkedInScrapeRequest(BaseModel):
    query: str
    max_results: int = 10

class InstaScrapeRequest(BaseModel):
    query: str = "" # username or hashtag
    max_posts: int = 10

class Lead(BaseModel):
    name: str
    title: str
    company: str
    source: str
    email: Optional[str] = None
    profile_url: str
    bio: Optional[str] = None
    scraped_at: str

class EmailRequest(BaseModel):
    lead: Lead
    product_description: str
    sender_name: str

class EmailResponse(BaseModel):
    subject: str
    body: str
    lead_name: str

class PostRequest(BaseModel):
    content: str
    schedule_time: Optional[str] = None

class PostResponse(BaseModel):
    status: str
    post_id: Optional[str] = None
    message: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str
    sources: List[str] = []

class PipelineRequest(BaseModel):
    query: str
    source: str
    product_description: str
    sender_name: str
    auto_post: bool = False

class PipelineResponse(BaseModel):
    leads: List[Lead]
    emails: List[EmailResponse]
    post_status: str
'''
with open(os.path.join(base, "models", "schemas.py"), "w") as f:
    f.write(schemas_content)

services = {
    "linkedin_service.py": '''from typing import List
from models.schemas import Lead, LinkedInScrapeRequest
from datetime import datetime

# DEMO FALLBACK
def scrape_linkedin(req: LinkedInScrapeRequest) -> List[Lead]:
    now = datetime.now().isoformat()
    return [
        Lead(name="Arjun Mehta", title="CEO", company="Madhuvan Group", source="LinkedIn", profile_url="https://linkedin.com", bio="Real estate developer in Vadodara", scraped_at=now),
        Lead(name="Priya Sharma", title="Owner", company="DentaZen Clinic", source="LinkedIn", profile_url="https://linkedin.com", bio="Dental clinic owner in Hyderabad", scraped_at=now),
        Lead(name="Ravi Nair", title="Co-Founder", company="Eventokart", source="LinkedIn", profile_url="https://linkedin.com", bio="Event marketplace for Hyderabad", scraped_at=now)
    ]
''',
    "insta_service.py": '''from typing import List
from models.schemas import Lead, InstaScrapeRequest
from datetime import datetime

# DEMO FALLBACK
def scrape_instagram(req: InstaScrapeRequest) -> List[Lead]:
    now = datetime.now().isoformat()
    return [
        Lead(name="Techify Solutions", title="Agency", company="Techify", source="Instagram", profile_url="https://instagram.com", bio="Digital agency based in Mumbai", scraped_at=now),
        Lead(name="Creative Hub", title="Studio", company="Creative Hub", source="Instagram", profile_url="https://instagram.com", bio="Design studio", scraped_at=now)
    ]
''',
    "email_service.py": '''from models.schemas import EmailRequest, EmailResponse

# DEMO FALLBACK
def write_email(req: EmailRequest) -> EmailResponse:
    return EmailResponse(
        subject=f"Quick question regarding {req.lead.company}",
        body=f"Hi {req.lead.name},\\n\\nI saw you are the {req.lead.title} at {req.lead.company}. We offer {req.req.product_description}. Would love to connect!\\n\\nBest,\\n{req.sender_name}",
        lead_name=req.lead.name
    )
''',
    "post_service.py": '''from models.schemas import PostRequest, PostResponse

# DEMO FALLBACK
def publish_post(req: PostRequest) -> PostResponse:
    return PostResponse(
        status="published",
        post_id="demo_123",
        message="Post published successfully"
    )
''',
    "rag_service.py": '''from models.schemas import ChatRequest, ChatResponse

# DEMO FALLBACK
def chat(req: ChatRequest) -> ChatResponse:
    return ChatResponse(
        reply="Cognify AI offers cutting-edge AI services including RAG chatbots, WhatsApp automation, and personalized lead generation systems.",
        sources=["Cognify AI Internal Docs"]
    )
'''
}

for name, content in services.items():
    with open(os.path.join(base, "services", name), "w") as f:
        f.write(content)

routers = {
    "linkedin_scraper.py": '''from fastapi import APIRouter
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
''',
    "insta_scraper.py": '''from fastapi import APIRouter
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
''',
    "email_writer.py": '''from fastapi import APIRouter
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
''',
    "post_automation.py": '''from fastapi import APIRouter
from typing import List
from models.schemas import PostRequest, PostResponse
from services.post_service import publish_post

router = APIRouter(prefix="/api/post", tags=["post"])
history = []

@router.post("/publish", response_model=PostResponse)
async def publish(req: PostRequest):
    res = publish_post(req)
    history.append(res)
    return res

@router.get("/history", response_model=List[PostResponse])
async def get_history():
    return history
''',
    "rag_chatbot.py": '''from fastapi import APIRouter, UploadFile, File
from models.schemas import ChatRequest, ChatResponse
from services.rag_service import chat

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    return chat(req)

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    return {"status": "uploaded", "filename": file.filename}
''',
    "pipeline.py": '''from fastapi import APIRouter
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
'''
}

for name, content in routers.items():
    with open(os.path.join(base, "routers", name), "w") as f:
        f.write(content)

main_content = '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="../.env")

from routers import linkedin_scraper, insta_scraper, email_writer, post_automation, rag_chatbot, pipeline

app = FastAPI(title="LeadFlow AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(linkedin_scraper.router)
app.include_router(insta_scraper.router)
app.include_router(email_writer.router)
app.include_router(post_automation.router)
app.include_router(rag_chatbot.router)
app.include_router(pipeline.router)

@app.get("/health")
async def health():
    return {"status": "ok", "modules": ["linkedin", "instagram", "email", "post", "rag"]}
'''
with open(os.path.join(base, "main.py"), "w") as f:
    f.write(main_content)

print("Backend setup script completed.")
