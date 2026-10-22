const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}


// Interactive AI terminal preview inside the Projects card.
(() => {
  const form = document.getElementById("preview-chat-form");
  const input = document.getElementById("preview-chat-input");
  const output = document.getElementById("preview-output");
  const send = document.getElementById("preview-chat-send");
  const status = document.getElementById("preview-status");
  if (!form || !input || !output || !send || !status) return;

  // For local development. Change only after deploying the backend.
  const API_BASE_URL = "https://talha-portfolio-chatbot-api.onrender.com";
  const history = [];
  let busy = false;

  function addLine(speaker, text, role = "") {
    const line = document.createElement("div");
    line.className = `preview-line ${role}`.trim();
    const prompt = document.createElement("span");
    prompt.className = "preview-prompt";
    prompt.textContent = speaker;
    const message = document.createElement("span");
    message.className = "preview-message";
    message.textContent = text;
    line.append(prompt, message);
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    return message;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;

    addLine("visitor@web:~$", question, "preview-user");
    history.push({ role: "user", content: question });
    input.value = "";
    busy = true;
    send.disabled = true;
    status.textContent = "THINKING";
    const answer = addLine("assistant@ai:~$", "Thinking...", "preview-assistant");

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`);
      const reply = data.reply || "I couldn't generate a response. Please try again.";
      answer.textContent = reply;
      history.push({ role: "assistant", content: reply });
      status.textContent = "CONNECTED";
    } catch (error) {
      answer.textContent = `Could not connect: ${error.message}. Check that the backend is running.`;
      history.pop();
      status.textContent = "OFFLINE";
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
      output.scrollTop = output.scrollHeight;
    }
  });
})();
