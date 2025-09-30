// types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GROK_API_KEY: string;
      OPEN_ROUTER_API_KEY: string;
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      DATABASE_URL?: string;
      // Add more environment variables as needed
    }
  }
}

export {};