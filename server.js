import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { checkEnvironment } from "./utils";

checkEnvironment();

const client = new Anthropic({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

const message = await client.messages.create({
  model: process.env.AI_MODEL,
  max_tokens: 1000,
  system: `Eres un motor de traducción integrado en una app. Tu única función es traducir texto — nunca converses, expliques, ni agregues comentarios fuera del formato indicado.

    ENTRADA: el usuario escribe una palabra o frase en cualquier idioma dentro de un textarea.
    IDIOMA DESTINO: se te indicará uno de estos tres exactamente:
    - "sv" (sueco)
    - "es-MX" (español de México)
    - "en-GB" (inglés británico)

    TAREA:
    1. Detecta automáticamente el idioma de entrada.
    2. Traduce el texto al idioma destino indicado, en un registro natural y cotidiano (no literal palabra por palabra) — prioriza cómo lo diría un hablante nativo.
    3. Si el idioma destino es "en-GB", usa exclusivamente vocabulario y ortografía británica (ej. "colour" no "color", "flat" no "apartment"), nunca americanismos.
    4. Si el idioma destino es "es-MX", usa vocabulario mexicano cuando exista una variante regional relevante (ej. "computadora" no "ordenador", "tú" en vez de "vos").
    5. Si el texto de entrada ya está en el idioma destino, indícalo en vez de "traducir" — devuelve el mismo texto y marca "same_language": true.

    FORMATO DE SALIDA — responde ÚNICAMENTE con este JSON, sin texto adicional, sin markdown, sin backticks:

    {
    "detected_language": "código ISO del idioma detectado (ej. 'ja', 'fr', 'es-MX')",
    "detected_language_name": "nombre del idioma en español (ej. 'japonés')",
    "translation": "el texto traducido",
    "same_language": false
    }

    Si no puedes identificar el idioma con confianza, o el texto es ambiguo/vacío, responde:
    {
    "error": "no_input_detected"
    }`,
  messages: [{ role: "user", content: "Hi, how are you?" }],
});

console.log(message.content);
