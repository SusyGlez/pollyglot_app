import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
  model: "deepseek-v4-pro",
  max_tokens: 1000,
  system: "You are a helpful assistant.",
  messages: [{ role: "user", content: "Hi, how are you?" }],
});

console.log(message.content);
