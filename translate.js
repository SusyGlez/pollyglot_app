import { marked } from "marked";
import DOMPurify from "dompurify";

const chatWindow = document.getElementById("chat-window");
const translateForm = document.getElementById("translate-form");
const userInput = document.getElementById("user-input");
const translateBtn = document.getElementById("translate-btn");
const flagButtons = document.querySelectorAll(".flag-btn");

const API_BASE = "http://localhost:3000";

let activeLanguage = "en-GB";
let lastOriginalText = "";

function start() {
  loadInitialExchange();
  setActiveFlag(activeLanguage);

  translateForm.addEventListener("submit", handleNewMessage);
  flagButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleFlagClick(btn.dataset.lang));
  });
}

function loadInitialExchange() {
  const stored = sessionStorage.getItem("translationResult");
  if (!stored) return;
  const { original, translation, targetLanguage } = JSON.parse(stored);
  lastOriginalText = original;
  activeLanguage = targetLanguage;

  addBubble(original, "user");
  addBubble(translation, "ai");

  sessionStorage.removeItem("translationResult");
}

async function handleNewMessage(event) {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  lastOriginalText = text;
  addBubble(text, "user");
  userInput.value = "";

  await requestTranslation(text, activeLanguage);
}

async function handleFlagClick(lang) {
  setActiveFlag(lang);
  activeLanguage = lang;

  if (!lastOriginalText) return;
  await requestTranslation(lastOriginalText, lang);
}

async function requestTranslation(text, lang) {
  translateBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: text, targetLanguage: lang }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    addBubble(data.translation, "ai");
  } catch (error) {
    console.error(error);
    addBubble(
      "Sorry, I can't access what I need right now. Please try again in a bit.",
    );
  } finally {
    translateBtn.disabled = false;
  }
}

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className =
    type === "user"
      ? "bg-[#7ED07E] text-black rounded-2xl p-4 self-start max-w-[85%]"
      : "bg-[#035A9D] text-white rounded-2xl p-4 self-end max-w-[85%]";

  bubble.innerHTML = DOMPurify.sanitize(marked.parse(text));
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setActiveFlag(lang) {
  flagButtons.forEach((btn) => {
    btn.classList.toggle("ring-4", btn.dataset.lang === lang);
  });
}

start();
