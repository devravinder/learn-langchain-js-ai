import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import type {OpenAI} from '@langchain/openai'

const ollama = new ChatOllama({
    model: "qwen2.5:0.5b",
    temperature: 0.9,
    maxRetries: 2,
    baseUrl: "http://localhost:11434",
  });
  
  const groq = new ChatGroq({
      apiKey: process.env.GROK_API_KEY!,
      model: "qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
      temperature: 0.9,
      maxTokens: 250,
    });



 export const model : OpenAI = (process.env.USE_LOCAL_MODELS == 'true' ? ollama : groq) as unknown as OpenAI   