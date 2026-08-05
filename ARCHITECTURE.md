# LeadFlow AI - Architecture Document

## Overview
LeadFlow AI is a unified AI-powered outreach platform designed for a hackathon demo. It integrates 5 independent modules into a cohesive pipeline that automates lead generation, email outreach, social media posting, and interactive AI Q&A.

## Modules Summary

### 1. RAG AI Chatbot (`modules/rag-ai-chatbot`)
*   **Purpose:** A RAG chatbot utilizing vector search and document Q&A to answer queries based on uploaded knowledge bases.
*   **Entry Point:** `app/api/chat/route.ts` (Originally Next.js, to be adapted to Python FastAPI)
*   **Inputs:** User queries (text), conversation history, uploaded documents (PDF/TXT).
*   **Outputs:** Generated chatbot responses (text), source citations.
*   **Dependencies:** `openai` (for OpenRouter integration), potentially a vector store like ChromaDB or FAISS for the Python backend.
*   **Credentials:** `OPENROUTER_API_KEY`, optional DB credentials.

### 2. Personalized Email Writer (`modules/personalized-emial-writer`)
*   **Purpose:** AI-powered generator that creates highly personalized cold outreach emails based on lead data and product descriptions.
*   **Entry Point:** `server.js` (Originally Node.js, to be adapted to Python FastAPI)
*   **Inputs:** Lead object (Name, Title, Company, Bio), product description, sender name.
*   **Outputs:** Email subject and body.
*   **Dependencies:** `openai` (for OpenRouter LLM calls).
*   **Credentials:** `OPENROUTER_API_KEY`.

### 3. LinkedIn Scraper (`modules/linked-in-scraper`)
*   **Purpose:** Scrapes LinkedIn profiles and company information based on search queries.
*   **Entry Point:** Main scraping script (Python/JS).
*   **Inputs:** Search query, `max_results`.
*   **Outputs:** List of `Lead` objects containing name, title, company, bio, profile url.
*   **Dependencies:** `requests`, `beautifulsoup4`, or a headless browser automation library like `playwright`/`selenium`.
*   **Credentials:** `LINKEDIN_EMAIL`, `LINKEDIN_PASSWORD` (Optional for demo mode).

### 4. Instagram Scraper (`modules/insta-scraper`)
*   **Purpose:** Extracts business profiles and post information from Instagram using usernames or hashtags.
*   **Entry Point:** Main scraping script (Python/JS).
*   **Inputs:** Username or hashtag, `max_posts`.
*   **Outputs:** List of `Lead` objects containing IG profiles.
*   **Dependencies:** `requests`, `beautifulsoup4`, or `playwright`.
*   **Credentials:** `INSTAGRAM_USERNAME`, `INSTAGRAM_PASSWORD` (Optional for demo mode).

### 5. LinkedIn Post Automation (`modules/linkedin-post-automation`)
*   **Purpose:** Generates and schedules/publishes promotional posts to LinkedIn.
*   **Entry Point:** Main publishing script.
*   **Inputs:** Post content (text), schedule time.
*   **Outputs:** Post status, post ID, success/failure message.
*   **Dependencies:** `requests` (for API calls to LinkedIn).
*   **Credentials:** LinkedIn Developer API tokens or session cookies (Optional for demo mode).

## Data Flow (Pipeline Order)
1.  **Lead Generation (Scraping):** The user initiates a search on LinkedIn or Instagram. The respective scraper module fetches raw data and structures it into `Lead` objects.
2.  **Email Personalization:** Each scraped `Lead` is passed to the Email Writer module, along with the user's product description and sender name, to generate personalized cold emails.
3.  **Social Media Automation (Optional):** If `auto_post` is enabled, the LinkedIn Post Automation module uses an LLM to generate a summary post about the outreach campaign and publishes it to the user's feed.
4.  **Interactive Q&A (RAG):** Simultaneously, the user or clients can interact with the RAG chatbot to ask questions about the services or the leads.

## Required Environment Variables
The following keys will be stored in a root `.env` file and loaded by the FastAPI application:
*   `OPENROUTER_API_KEY`: Required for the email writer and RAG chatbot.
*   `LINKEDIN_EMAIL` & `LINKEDIN_PASSWORD`: For live LinkedIn scraping.
*   `INSTAGRAM_USERNAME` & `INSTAGRAM_PASSWORD`: For live Instagram scraping.

## Unified Folder Structure
We will adopt the following structure to centralize the modules into a modern web stack:

```text
leadflow-ai/
├── modules/                   # Original cloned repositories
├── backend/                   # FastAPI backend wrapper
│   ├── main.py                # Main entry point for FastAPI
│   ├── requirements.txt       # Unified Python dependencies
│   ├── routers/               # API endpoints
│   ├── services/              # Python wrappers for the 5 modules
│   └── models/                # Pydantic data schemas
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── api/               # Axios client for backend communication
│   │   ├── components/        # Reusable UI components
│   │   └── pages/             # Application views
│   └── ...
├── .env                       # Centralized environment variables
├── run.sh                     # Startup script
└── README.md                  # Project documentation
```

## Tech Stack Decision
*   **Frontend:** React + Vite (for a fast, modern, and responsive UI).
*   **Backend:** FastAPI (Python) wrapped as API endpoints to ensure type safety (via Pydantic) and asynchronous performance.
*   **Services:** All 5 modules will be treated as Python backend services, with fallback "demo modes" to guarantee zero crashes during the hackathon.
