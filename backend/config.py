import os
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

class Settings:
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", 5000))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CORS_ORIGIN: str = os.getenv("CORS_ORIGIN", "http://localhost:5173")
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "gemini-1.5-flash")

settings = Settings()

def resolve_api_key(header_key: str = None) -> str:
    """
    Resolves the active API key:
    Prioritizes request header 'X-Gemini-Key' over server environment variables.
    """
    if header_key and header_key.strip():
        return header_key.strip()
    return settings.GEMINI_API_KEY.strip()
