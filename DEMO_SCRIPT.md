# LeadFlow AI — 5 Minute Demo Script
AURORA '26 | AI for Good Hackathon | Sathyabama Institute of Science and Technology
August 7, 2026 | AI Supercomputing Lab, SCAS Block

---

## Before you walk up to the judges

- [ ] Run ./run.sh and confirm both servers are running
- [ ] Open http://localhost:5173 in Chrome, maximized, no other tabs
- [ ] Open DevTools Network tab — keep it visible to show real API calls
- [ ] Clear localStorage: open DevTools Console, type localStorage.clear(), press Enter
- [ ] Refresh the page — MetricCards should all show 0
- [ ] Have your OpenRouter API key copied to clipboard
- [ ] Paste it into Post Automation page → API key field → save it
- [ ] Come back to Dashboard

---

## [0:00 – 0:30] Opening

"This is LeadFlow AI. Solo founders and small business owners spend 4 to 6 hours every day 
finding leads, writing emails, and posting content. We reduce that to one button click."

→ Point to the 5-step PipelineFlow diagram on Dashboard
→ "Five AI modules. One unified pipeline. Built on real open-source code."

---

## [0:30 – 1:30] LinkedIn Scraper

"Let's start by finding leads."
→ Click LinkedIn Scraper in sidebar
→ Point to demo banner: "This shows it's running in demo mode — the real version 
   connects to LinkedIn with credentials."
→ Type: real estate agency Hyderabad
→ Click Scrape — point to the progress bar and spinner
→ Leads appear: "4 leads in under 2 seconds. Name, company, title, bio — all captured."

---

## [1:30 – 2:30] Email Writer

"Now I'll write a personalized cold email for one of these leads."
→ Click Email Writer in sidebar
→ Select Arjun Mehta from the dropdown: "Already there — pulled from the scrape."
→ Product description: AI chatbots and WhatsApp automation for real estate agencies
→ Sender name: Ganesh
→ Click Write Email
→ Email appears: "The AI read his bio, his role, his company. Fully personalized. 
   Subject line, body, CTA — under 5 seconds."
→ Click Copy: "One click to clipboard."

---

## [2:30 – 3:15] Post Automation

"Now let's publish a LinkedIn post about this campaign."
→ Click Post Automation in sidebar
→ Click Generate Post: "AI writes a hook, results, and CTA."
→ Post appears in textarea
→ Click Publish to LinkedIn
→ Success toast appears — post shows in history table below
→ "Post is live. No copy-pasting, no manual scheduling."

---

## [3:15 – 4:00] RAG Chatbot

"Finally — the RAG chatbot. Our clients embed this on their website."
→ Click RAG Chatbot in sidebar
→ Click chip: "What services do I offer?"
→ Bot responds
→ Type follow-up: "Which of my leads would benefit most from a chatbot?"
→ Bot responds
→ "It knows our services. It knows our leads. Fully context-aware."

---

## [4:00 – 4:45] Full Pipeline Demo

"But the real power — everything in one click."
→ Click Dashboard in sidebar
→ Click Demo Mode button
→ Watch the pipeline animate step by step
→ Watch MetricCards update live
→ Point to success toast: "4 leads. 1 email. 1 post. 8 seconds."

---

## [4:45 – 5:00] Close

"LeadFlow AI is built on 5 real Python modules, a FastAPI backend, 
React frontend, and the Claude AI model via OpenRouter."
→ Flip to DevTools Network tab briefly: "Every request you saw was a real API call."
→ "This is what AI for good looks like for local businesses. Thank you."

---

## If something goes wrong

| Problem | Fix |
|---------|-----|
| Backend not running | cd backend && uvicorn main:app --port 8000 |
| Frontend not running | cd frontend && npm run dev |
| API call fails | Demo fallbacks kick in automatically — continue the demo |
| OpenRouter key error | Paste key again in Post Automation page |
| Page looks broken | Refresh once — if still broken, switch to next module |
| Judge asks about real data | "The demo mode uses realistic sample data — the real scrapers connect with credentials" |
