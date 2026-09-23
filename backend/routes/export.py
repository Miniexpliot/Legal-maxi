from fastapi import APIRouter, Response
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from ..services.export_service import export_service

router = APIRouter(prefix="/api", tags=["Export & Reporting"])

class ExportRequest(BaseModel):
    title: str = Field(default="Legal Document Review")
    content: str = Field(description="Markdown analysis content")
    format: str = Field(default="html", description="Format: html, markdown, json")
    metadata: Optional[Dict[str, Any]] = None

@router.post("/export")
def export_report(req: ExportRequest):
    if req.format.lower() == "html":
        html_output = export_service.generate_html_report(req.title, req.content, req.metadata)
        return Response(content=html_output, media_type="text/html")
    elif req.format.lower() == "markdown":
        return Response(content=req.content, media_type="text/markdown")
    else:
        return {
            "title": req.title,
            "content": req.content,
            "metadata": req.metadata or {}
        }
