from models.schemas import EmailRequest, EmailResponse

def write_email(req: EmailRequest) -> EmailResponse:
    first_name = req.lead.name.split(' ')[0] if req.lead and req.lead.name else "there"
    company = req.lead.company if req.lead and req.lead.company else "your company"
    title = req.lead.title if hasattr(req.lead, 'title') and req.lead.title else "operations"
    sender = req.sender_name if req.sender_name else "Ganesh"
    
    body = (
        f"Hey {first_name},\n\n"
        f"Noticed your work leading {title} at {company}. Figured I'd reach out.\n\n"
        f"I just finished building a custom AI agent for {company} that captures sales the moment buyers are ready and handles support.\n\n"
        f"It's ready for you. Reply and I will hand it over.\n\n"
        f"Best,\n\n"
        f"{sender}"
    )

    return EmailResponse(
        subject=f"{first_name} overview",
        body=body,
        lead_name=req.lead.name if req.lead else "Lead"
    )
