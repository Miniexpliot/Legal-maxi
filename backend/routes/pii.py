from fastapi import APIRouter
from pydantic import BaseModel, Field
from ..services.pii_scrubber import pii_scrubber

router = APIRouter(prefix="/api", tags=["Privacy & PII"])

class RedactRequest(BaseModel):
    text: str = Field(description="Raw document text containing potential PII")

@router.post("/redact-pii")
def redact_sensitive_pii(req: RedactRequest):
    masked_text, stats = pii_scrubber.scrub(req.text)
    total_redacted = sum(stats.values())

    return {
        "success": True,
        "masked_text": masked_text,
        "stats": stats,
        "total_redactions": total_redacted
    }
