const translateForm = document.getElementById("translate-form");
const userInput = document.getElementById("user-input");
const translateBtn = document.getElementById("translate-btn");

const API_BASE = "http://localhost:5173";

function start() {
  translateForm.addEventListener("submit", handleTranslationRequest);
}

async function handleTranslationRequest(event) {
  event.preventDefault();

  const userPrompt = userInput.value.trim();
  const selectedLanguage = document.querySelector(
    'input[name="language"]:checked',
  )?.value;

  if (!userPrompt || !selectedLanguage) return;

  translateBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt, targetLanguage: selectedLanguage }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    sessionStorage.setItem(
      "translationResult",
      JSON.stringify({ original: userPrompt, translation: data.translation }),
    );

    window.location.href = "translate.html";
  } catch (error) {
    console.error(error);
    alert(
      "Sorry, I can't access what I need right now. Please try again in a bit.",
    );
  } finally {
    translateBtn.disabled = false;
  }
}

start();
