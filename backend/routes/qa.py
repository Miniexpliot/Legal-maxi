from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..config import resolve_api_key
from ..services.gemini_service import gemini_service
from ..services.doc_parser import doc_parser

router = APIRouter(prefix="/api", tags=["Document Q&A"])

class QARequest(BaseModel):
    document_text: str = Field(description="Document text context")
    question: str = Field(description="User legal query")
    model: Optional[str] = Field(default="gemini-1.5-flash")

@router.post("/qa")
async def answer_legal_question(req: QARequest, x_gemini_key: Optional[str] = Header(None)):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="A question is required.")
    if not req.document_text.strip():
        raise HTTPException(status_code=400, detail="Document text context is required.")

    chunks = doc_parser.chunk_document(req.document_text, chunk_size=2000)

    api_key = resolve_api_key(x_gemini_key)
    result = await gemini_service.generate_analysis(
        task_type="qa",
        document_text=req.document_text,
        prompt=req.question,
        api_key=api_key,
        model_name=req.model or "gemini-1.5-flash",
        redact_pii=True
    )

    return {
        "success": True,
        "answer": result.get("content", ""),
        "chunks_indexed": len(chunks),
        "is_live_ai": result.get("is_live_ai", False),
        "pii_redacted": result.get("pii_redacted", {})
    }
