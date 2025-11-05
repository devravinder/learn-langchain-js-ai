# Setup

1. We need at least two llm models to communicate, one for embeddings & another for chat
   1. recommonded (cloud)
      - models
        - embeddings: google text-embedding-004
        - chat: qwen/qwen3-32b (through grok)

      - provide `GROK_API_KEY`  & `GOOGLE_AI_STUDIO_API_KEY` api keys in .env & set `MODELS_ENV=CLOUD`

   2. local
      - use ollama & pull
        - embeddings: nomic-embed-text:v1.5
        - chat: qwen2.5:0.5b
        
      - set env varable `MODELS_ENV=LOCAL` 

   3.hybrid
     - refer `models.ts` and configure




2. Postgres db to store messages
   - pass db env variables in .env
3. qdrant db for vector storage
   - pass qdrant url in .env
4. 
