# DB Agent

## Note:-
- ref: 
     - https://github.com/mongodb-developer/LangGraph.js-MongoDB-Example
     - https://www.youtube.com/watch?v=qXDrWKVSx1w

- I have implemed db agent for `qdrantdb` by taking refeence from `mongodb-agent` from the above links


## How to use
- first add env variables
  ```
     PORT=3001
     USE_LOCAL_MODELS=false
     # true / false

     # add only required keys & adjust in models.ts
     GROK_API_KEY=key
     OPEN_ROUTER_API_KEY=key
     OLLAMA_API_KEY=key
     GOOGLE_AI_STUDIO_API_KEY=key


     QDRANT_URL=http://localhost:6333
  ```

- then seed employee data to vector store
  `pnpm run seed`

- then run server
  `pnpm run dev`

- then hit the apis
  1. ```shell
       curl -X POST -H "Content-Type: application/json" -d '{"message": "Build a team to make an iOS app, and tell me the talent gaps."}' http://localhost:3001/api/chat/123456789
     ```

   2. ```shell
       curl -X POST -H "Content-Type: application/json" -d '{"message": "What team members did you recommend?"}' http://localhost:3001/api/chat/123456789
      ```


