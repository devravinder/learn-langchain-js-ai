import { ChatGroq } from "@langchain/groq";

export const grokLlm = new ChatGroq({
  apiKey: process.env.GROK_API_KEY,
  model: "qwen/qwen3-32b", //"qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
  temperature: 0.9,
  // maxTokens: 500, // employee data generation requires more
});
