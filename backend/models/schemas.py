from pydantic import BaseModel
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
