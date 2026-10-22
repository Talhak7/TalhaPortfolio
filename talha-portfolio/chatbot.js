/*
 * Local development: keep API_BASE_URL as http://127.0.0.1:8000.
 * After deploying the FastAPI backend, replace it with your backend URL.
 * Never put the LLM API key in this file.
 */
const API_BASE_URL = "https://talha-portfolio-chatbot-api.onrender.com";

const transcript = document.getElementById("chat-transcript");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const sendButton = document.getElementById("chat-send");
const statusLabel = document.getElementById("connection-status");
const suggestionButtons = document.querySelectorAll(".chat-suggestion");

const conversation = [];
const MAX_HISTORY_MESSAGES = 10;

function addLine(role, speaker, message) {
  const line = document.createElement("div");
  line.className = `chat-line ${role}`;

  const speakerEl = document.createElement("span");
  speakerEl.className = "chat-speaker";
  speakerEl.textContent = speaker;

  const messageEl = document.createElement("span");
  messageEl.className = "chat-message";
  // textContent is intentional: never render model output as HTML.
  messageEl.textContent = message;

  line.append(speakerEl, messageEl);
  transcript.appendChild(line);
  transcript.scrollTop = transcript.scrollHeight;
  return line;
}

function setStatus(text, isReady = true) {
  statusLabel.replaceChildren();
  const dot = document.createElement("span");
  dot.className = "chat-live";
  if (!isReady) dot.style.background = "#d7b65d";
  statusLabel.append(dot, document.createTextNode(` ${text}`));
}

async function sendMessage(rawMessage) {
  const message = rawMessage.trim();
  if (!message || sendButton.disabled) return;

  addLine("user", "visitor@web:~$", message);
  conversation.push({ role: "user", content: message });
  input.value = "";
  sendButton.disabled = true;
  input.disabled = true;
  setStatus("THINKING", false);
  const thinkingLine = addLine("assistant", "assistant@ai:~$", "processing request...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation.slice(-MAX_HISTORY_MESSAGES)
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || `Request failed (${response.status})`);
    }
    thinkingLine.querySelector(".chat-message").textContent =
      payload.reply || "I couldn't generate a response. Please try again.";
    conversation.push({ role: "assistant", content: payload.reply || "" });
    setStatus("CONNECTED");
  } catch (error) {
    thinkingLine.querySelector(".chat-message").textContent =
      `Error: ${error.message}. Check that the Python backend is running and API_BASE_URL points to it.`;
    // Remove the last user message from stored history if the request failed.
    conversation.pop();
    setStatus("BACKEND UNAVAILABLE", false);
  } finally {
    sendButton.disabled = false;
    input.disabled = false;
    input.focus();
    transcript.scrollTop = transcript.scrollHeight;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Escape") input.value = "";
});
