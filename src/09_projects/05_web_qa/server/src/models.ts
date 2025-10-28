import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatGroq,  } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";


const grokOpenRouter = new ChatOpenAI({
  model: "x-ai/grok-4-fast:free",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  temperature: 0.9,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

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
  maxTokens: 500,
});

//===

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text:v1.5",
  baseUrl: "http://localhost:11434",
});

export const chatModel = process.env.USE_LOCAL_MODELS == "true" ? ollama : grok;

export const embeddingModel = embeddings;
