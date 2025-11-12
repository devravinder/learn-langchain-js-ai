declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GROK_API_KEY: string;
      OPEN_ROUTER_API_KEY: string;
      OLLAMA_API_KEY: string;
      GOOGLE_AI_STUDIO_API_KEY: string;

      //
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_DB: string;

      //
      QDRANT_URL: string;

      //
      MESSAGE_STORAGE: "PG" | "IN_MEMORY";

      MODELS_ENV: "LOCAL" | "CLOUD" | "HYBROD";
    }
  }
}

export {};
