from models.schemas import ChatRequest, ChatResponse

# DEMO FALLBACK
def chat(req: ChatRequest) -> ChatResponse:
    return ChatResponse(
        reply="Cognify AI is an applied AI automation studio based in Hyderabad, founded by Ganesh. We build RAG chatbots, WhatsApp lead qualification bots, multi-agent systems, and AI-generated video content for local businesses. Our clients include real estate agencies, dental clinics, and event companies. Reply with a specific question about our services or your leads!",
        sources=["Cognify AI — Company Overview"]
    )
