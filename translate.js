import { marked } from "marked";
import DOMPurify from "dompurify";

const userInput = document.getElementById("user-input");
const translationOutput = document.getElementById("translation-output");

function start() {
  const stored = sessionStorage.getItem("translationResult");
  if (!stored) return;

  const { original, translation } = JSON.parse(stored);

  userInput.value = original;

  const html = marked.parse(translation);
  const safeHtml = DOMPurify.sanitize(html);
  translationOutput.innerHTML = safeHtml;
}

start();
