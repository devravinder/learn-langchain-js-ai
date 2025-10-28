declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GROK_API_KEY: string;
      OPEN_ROUTER_API_KEY: string
      QDRANT_URL: string
    }
  }
}

export {};
