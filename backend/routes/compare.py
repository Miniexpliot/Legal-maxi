from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..config import resolve_api_key
from ..services.gemini_service import gemini_service
from ..services.redline_engine import redline_engine

router = APIRouter(prefix="/api", tags=["Contract Comparison"])

class CompareRequest(BaseModel):
    document_a: str = Field(description="Baseline contract text (Document A)")
    document_b: str = Field(description="Modified/Counterparty contract text (Document B)")
    prompt: Optional[str] = Field(default=None, description="Optional comparison directive")
    model: Optional[str] = Field(default="gemini-1.5-flash")

@router.post("/compare")
async def compare_contracts(req: CompareRequest, x_gemini_key: Optional[str] = Header(None)):
    if not req.document_a.strip() or not req.document_b.strip():
        raise HTTPException(status_code=400, detail="Both document_a and document_b are required for comparison.")

    # 1. Structural and textual diff
    diff_data = redline_engine.compute_diff(req.document_a, req.document_b)

    # 2. Semantic comparison via AI
    comparison_prompt = f"""Compare these two versions of the agreement:

DOCUMENT A (Baseline):
{req.document_a[:15000]}

DOCUMENT B (Counterparty Revisions):
{req.document_b[:15000]}

{req.prompt or 'Identify major legal discrepancies, shifted risks, missing clauses, and recommended redlines.'}"""

    api_key = resolve_api_key(x_gemini_key)
    ai_result = await gemini_service.generate_analysis(
        task_type="compare",
        document_text=req.document_a,
        prompt=comparison_prompt,
        api_key=api_key,
        model_name=req.model or "gemini-1.5-flash",
        redact_pii=True
    )

    return {
        "success": True,
        "diff_metrics": diff_data,
        "ai_analysis": ai_result.get("content", ""),
        "is_live_ai": ai_result.get("is_live_ai", False),
        "pii_redacted": ai_result.get("pii_redacted", {})
    }
