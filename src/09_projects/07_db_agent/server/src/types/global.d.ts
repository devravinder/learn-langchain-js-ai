declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GROK_API_KEY: string;
      OPEN_ROUTER_API_KEY: string
      QDRANT_URL: string
      OLLAMA_API_KEY: string
      GOOGLE_AI_STUDIO_API_KEY: string
    }
  }
}

export {};
