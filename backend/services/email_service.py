from models.schemas import EmailRequest, EmailResponse

# DEMO FALLBACK
def write_email(req: EmailRequest) -> EmailResponse:
    return EmailResponse(
        subject=f"Quick idea for {req.lead.name} at {req.lead.company}",
        body=f"Hi {req.lead.name},\n\nI came across {req.lead.company} and noticed you're doing great work in your space.\n\nWe've built an AI chatbot system that's helped similar businesses automate lead qualification — one client saw 3x more qualified leads in the first month without adding headcount.\n\nAlready built something specific for your industry. Reply and I'll send it over.\n\nBest,\n{req.sender_name}\nCognify AI",
        lead_name=req.lead.name
    )
