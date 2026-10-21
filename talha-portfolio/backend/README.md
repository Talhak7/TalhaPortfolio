# Portfolio chatbot backend (Groq free tier)

## Windows / VS Code setup

1. Install Python 3.11 or newer.
2. Open a terminal in this `backend` folder.
3. Create and activate a virtual environment:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   ```

4. Create your environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

5. Open `.env` and set `GROQ_API_KEY` using a key from https://console.groq.com/keys. Keep it secret.
6. Start the API from this folder:

   ```powershell
   python -m uvicorn main:app --reload --port 8000
   ```

7. Confirm http://127.0.0.1:8000/health returns `{"status":"ok"}`.
8. Open the portfolio `index.html` with VS Code Live Server (usually port 5500).

The project uses Groq's OpenAI-compatible Chat Completions API. Free-tier models and rate limits can change; check your Groq console if a model is unavailable or you receive a rate-limit error.
