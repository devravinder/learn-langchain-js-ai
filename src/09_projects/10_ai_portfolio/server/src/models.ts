import { ChatOllama, OllamaEmbeddings, Ollama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";

const grokOpenRouter = new ChatOpenAI({
  model: "x-ai/grok-4-fast:free",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  temperature: 0.9,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

//=============

const grok = new ChatGroq({
  apiKey: process.env.GROK_API_KEY,
  model: "qwen/qwen3-32b", //"qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
  temperature: 0.9,
  // maxTokens: 500, // employee data generation requires more
});

//=====

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 'gemini-embedding-001'
  apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
});

// https://ai.google.dev/gemini-api/docs/models#
const googleModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
  model: "gemini-2.5-flash-lite", //"gemini-2.5-flash",
  temperature: 0.9,
  maxRetries: 2,
});

//===

const localEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text:v1.5",
  baseUrl: "http://localhost:11434",
});

const localOllama = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
});

const cloud = {
  chatModel: grok,
  embeddingModel: googleEmbeddings,
};

export const google = {
  chatModel: googleModel,
  embeddingModel: googleEmbeddings,
};

const local = {
  chatModel: localOllama,
  embeddingModel: localEmbeddings,
};

const hybrid = {
  chatModel: grok,
  embeddingModel: localEmbeddings,
};

const models = (() => {
  switch (process.env.MODELS_ENV) {
    case "CLOUD":
      return cloud;

    case "HYBROD":
      return hybrid;

    default:
      return local;
  }
})();

export const { chatModel, embeddingModel } = models;
export default models;

/* 
 combinations:

     chatModel - embeddingModel
 1.  googleModel - googleEmbeddings
 2.  groq  - localEmbeddings
 3.  localOllama - localEmbeddings
 4.  groq - googleEmbeddings


*/
