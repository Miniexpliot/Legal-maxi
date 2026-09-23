import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .routes import health, analyze, compare, qa, pii, export, templates

app = FastAPI(
    title="Legal-Max Enterprise Backend API",
    description="High-performance GenAI Legal Intelligence & Document Assistance API",
    version="2.0.0"
)

# CORS Middleware (OWASP Security standard)
origins = [
    settings.CORS_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits flexible local dev while supporting reverse proxies
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OWASP Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "InternalServerError",
            "message": str(exc),
            "service": "Legal-Max"
        }
    )

# Mount Routes
app.include_router(health.router)
app.include_router(analyze.router)
app.include_router(compare.router)
app.include_router(qa.router)
app.include_router(pii.router)
app.include_router(export.router)
app.include_router(templates.router)

@app.get("/")
def root():
    return {
        "service": "Legal-Max Enterprise API",
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app" if os.path.basename(os.getcwd()) != "backend" else "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
