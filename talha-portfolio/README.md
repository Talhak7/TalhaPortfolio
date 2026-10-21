# Talha Khan — Portfolio + Interactive AI Terminal

Static HTML/CSS/JavaScript portfolio with two chatbot interfaces: an interactive terminal preview in the Projects card and a dedicated `chatbot.html` page. Both use the same FastAPI backend and Groq API key kept on the server.

## Run on Windows

### 1. Backend
Open a VS Code terminal in `backend` and run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and add your Groq API key from https://console.groq.com/keys. Then run:

```powershell
python -m uvicorn main:app --reload --port 8000
```

Keep the backend terminal open. Check http://127.0.0.1:8000/health.

### 2. Frontend
Open the project root in VS Code, install/use the Live Server extension, then right-click `index.html` and choose **Open with Live Server**. The embedded terminal preview is in the Projects section. `chatbot.html` is the full-page chat interface.

## Interface behavior

- The terminal output has a fixed height and its own scrollbar, so long conversations do not overlap the project card.
- New messages scroll into view automatically; visitors can scroll upward inside the terminal to read earlier messages.
- The send button is disabled while a request is in progress to prevent overlapping responses.
- `Failed to fetch` usually means the backend is stopped, the URL is wrong, or CORS settings do not include the frontend origin.

## Security and deployment

- Never put the Groq API key in frontend files or commit `.env`.
- This demo includes a basic per-IP rate limit; use a stronger shared rate limiter for a public production service.
- For deployment, host the frontend and backend separately if needed, set `FRONTEND_ORIGINS` to your actual frontend origin, and change `API_BASE_URL` in `chatbot.js` and `API_BASE_URL` in `script.js` to the deployed backend's HTTPS URL.
- Groq free-tier availability, models, and rate limits can change.
