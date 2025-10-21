import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";

import aiChatService from "./services/aiService";

const start = () => {
  const app = new Elysia({ adapter: node() });

  const PORT = process.env.PORT || 3001;

  app.use(cors()).use(import("./routes")).all("/*", "Not Found").listen(PORT);

  console.log(`🦊 Elysia is running at ${PORT}`);
};

const setup = async () => {
  await aiChatService.initializeService();
};



setup()
.then(start)
.catch(()=>{
  console.log("error")
  process.exit()
})
