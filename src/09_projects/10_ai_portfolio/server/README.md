# PDF Agent
- a utility tool to ask questions & get the data from pdf files

## How to use
- first add env variables
  ```
     PORT=3001
      MODELS_ENV=CLOUD
     # LOCAL | CLOUD | HYBROD

     # add only required keys & adjust in models.ts
     GROK_API_KEY=key
     OPEN_ROUTER_API_KEY=key
     OLLAMA_API_KEY=key
     GOOGLE_AI_STUDIO_API_KEY=key


     QDRANT_URL=http://localhost:6333
  ```


## Development
- for proper open api types - use elysia typebox (elysia.t) & define schema