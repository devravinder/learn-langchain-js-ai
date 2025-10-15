import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";

export const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
});

/* const model = new ChatGroq({
    apiKey: process.env.GROK_API_KEY,
    model: "qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
    temperature: 0.9,
    maxTokens: 250,
  }); */

type Message = {
  role: string;
  content: string;
};
