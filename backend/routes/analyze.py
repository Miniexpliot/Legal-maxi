from fastapi import APIRouter, Header, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional
from ..config import resolve_api_key
from ..services.gemini_service import gemini_service

router = APIRouter(prefix="/api", tags=["Legal Analysis"])

class AnalyzeRequest(BaseModel):
    task_type: str = Field(default="simplify", description="Task type: simplify, scan, summary, rights, compliance")
    document_text: str = Field(default="", description="The text of the legal agreement")
    prompt: Optional[str] = Field(default=None, description="Optional custom prompt or user query")
    model: Optional[str] = Field(default="gemini-1.5-flash", description="Gemini model to use")
    redact_pii: Optional[bool] = Field(default=True, description="Whether to mask PII prior to AI processing")

@router.post("/analyze")
async def analyze_legal_document(req: AnalyzeRequest, x_gemini_key: Optional[str] = Header(None)):
    if not req.document_text.strip() and not req.prompt:
        raise HTTPException(status_code=400, detail="Either document_text or prompt must be supplied.")

    api_key = resolve_api_key(x_gemini_key)

    result = await gemini_service.generate_analysis(
        task_type=req.task_type,
        document_text=req.document_text,
        prompt=req.prompt,
        api_key=api_key,
        model_name=req.model or "gemini-1.5-flash",
        redact_pii=req.redact_pii
    )

    return result

@router.post("/parse-file")
async def parse_uploaded_file(file: UploadFile = File(...)):
    try:
        from ..services.doc_parser import doc_parser
        content = await file.read()
        filename = (file.filename or "").lower()

        if filename.endswith(".pdf") or file.content_type == "application/pdf":
            text = doc_parser.extract_text_from_pdf(content)
        elif filename.endswith((".docx", ".doc")):
            text = doc_parser.extract_text_from_docx(content)
        else:
            try:
                text = content.decode("utf-8")
            except UnicodeDecodeError:
                text = content.decode("latin-1", errors="ignore")

        return {
            "success": True,
            "filename": file.filename,
            "text": text,
            "length": len(text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {str(e)}")
