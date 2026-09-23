# ⚖️ Legal-Max Enterprise Backend API

Welcome to the **Legal-Max Backend**, a high-performance GenAI legal intelligence server powered by FastAPI and Google Gemini.

---

## 🚀 Quick Start Guide

### 1. Requirements & Prerequisites
- Python 3.10+ (Python 3.11, 3.12, or 3.14 supported)
- Google Gemini API Key ([Get your key here](https://aistudio.google.com/app/apikey))

### 2. Installation
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

*(Optional Recommended: use a virtual environment)*
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

### 3. API Key Configuration
You have **two flexible ways** to provide your Gemini API key:

#### Method A: Server Environment File (Recommended for Local Dev)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and insert your API key:
```env
HOST=127.0.0.1
PORT=5000
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

#### Method B: Dynamic Frontend Injection (Zero-Config Server)
Leave `GEMINI_API_KEY` blank in `.env`.
Open the **Legal-Max Frontend**, go to the **Settings** page, and enter your Gemini API key into the input field. The frontend will automatically pass your key securely to the backend on each request via the `X-Gemini-Key` header!

---

## 🏃 Running the Backend Server

Start the FastAPI application with auto-reload:

```bash
python main.py
```
*Or via Uvicorn:*
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 5000 --reload
```

The server will be available at:
- **API Base URL**: `http://127.0.0.1:5000`
- **Interactive Swagger Docs**: `http://127.0.0.1:5000/docs`
- **Health Check**: `http://127.0.0.1:5000/api/health`

---

## 🧪 Running Automated Backend Tests

Verify all security filters, PII scrubbers, and AI fallback services:

```bash
pytest backend/tests/test_backend.py -v
```

---

## 🔗 How Frontend Connects to this Backend

1. **Automatic Vite Reverse Proxy**:
   The frontend `vite.config.js` is pre-configured with a reverse proxy forwarding all `/api/*` calls directly to `http://127.0.0.1:5000`.
2. **Dual-Mode Adapter (`src/services/apiClient.js`)**:
   - If the backend is running, the frontend calls the high-speed backend endpoints.
   - If the backend is offline, the frontend seamlessly degrades to in-browser execution with informative fallback responses — zero broken UI!
