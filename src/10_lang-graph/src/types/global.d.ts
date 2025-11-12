declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GROK_API_KEY: string;
    }
  }
}

export {};
