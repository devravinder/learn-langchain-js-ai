declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_DB: string;

      USE_LOCAL_MODELS: string
    }
  }
}

export {};
