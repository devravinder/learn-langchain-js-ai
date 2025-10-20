import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";



const ollama = new ChatOllama({
    model: "qwen2.5:0.5b",
    temperature: 0.9,
    maxRetries: 2,
    baseUrl: "http://localhost:11434",
  });
  
  const grok = new ChatGroq({
      apiKey: process.env.GROK_API_KEY,
      model: "qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
      temperature: 0.9,
      maxTokens: 250,
    });
  

  export const model = process.env.USE_LOCAL_MODELS == 'true' ? ollama : grok  