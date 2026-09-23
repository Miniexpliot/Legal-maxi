from fastapi import APIRouter, Header
from typing import Optional
from ..config import settings, resolve_api_key

router = APIRouter(prefix="/api", tags=["System"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Legal-Max Enterprise Backend",
        "version": "2.0.0",
        "env_key_configured": bool(settings.GEMINI_API_KEY)
    }

@router.get("/config")
def get_config(x_gemini_key: Optional[str] = Header(None)):
    active_key = resolve_api_key(x_gemini_key)
    has_valid_key = len(active_key) > 10

    return {
        "has_active_key": has_valid_key,
        "key_source": "request_header" if x_gemini_key else ("environment" if settings.GEMINI_API_KEY else "none"),
        "default_model": settings.DEFAULT_MODEL,
        "supported_models": ["gemini-1.5-flash", "gemini-1.5-pro"]
    }
