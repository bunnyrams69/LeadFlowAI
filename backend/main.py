from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="../.env")

from routers import linkedin_scraper, insta_scraper, email_writer, post_automation, rag_chatbot, pipeline

app = FastAPI(title="LeadFlow AI")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://leadflow-ai.vercel.app",
    "https://*.vercel.app"
]

port = int(os.environ.get("PORT", 8000))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex="https://.*\\.vercel\\.app",
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
