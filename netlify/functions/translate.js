import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }
  try {
    const { userPrompt, targetLanguage } = JSON.parse(event.body);

    const message = await client.messages.create({
      model: process.env.AI_MODEL,
      max_tokens: 1000,
      system: `You are a translation engine built into an app. Your only function is to translate text — never converse, explain, or add comments outside the specified format.

        INPUT: the user types a word or phrase in any language into a textarea.
        TARGET LANGUAGE: you will be given exactly one of these three:
        - "sv" (Swedish)
        - "es-MX" (Mexican Spanish)
        - "en-GB" (British English)

        TASK:
        1. Automatically detect the input language.
        2. Translate the text into the target language, in a natural, everyday register (not word-for-word) — prioritise how a native speaker would actually say it.
        3. If the target language is "en-GB", use exclusively British vocabulary and spelling (e.g. "colour" not "color", "flat" not "apartment"), never Americanisms.
        4. If the target language is "es-MX", use Mexican vocabulary where a relevant regional variant exists (e.g. "computadora" not "ordenador", "tú" instead of "vos").
        5. If the input text is already in the target language, indicate this rather than "translating" it — return the same text and mark "same_language": true.

        OUTPUT FORMAT — respond ONLY with this JSON, no additional text, no markdown, no backticks:

        {
        "detected_language": "ISO code of the detected language (e.g. 'ja', 'fr', 'es-MX')",
        "detected_language_name": "language name in English (e.g. 'Japanese')",
        "translation": "the translated text",
        "same_language": false
        }

        If you cannot confidently identify the language, or the text is ambiguous/empty, respond:
        {
        "error": "no_input_detected"
        }`,
      messages: [
        {
          role: "user",
          content: `Target Language: ${targetLanguage}\nText: ${userPrompt}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const parsed = JSON.parse(textBlock.text);

    return { statusCode: 200, body: JSON.stringify(parsed) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "It's not you, it's us. Something went wrong with the server",
      }),
    };
  }
};
