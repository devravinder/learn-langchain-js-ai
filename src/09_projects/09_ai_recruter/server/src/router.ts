import { Elysia } from "elysia";
import { randomUUID } from "crypto";

import { callAgent, getConversations, getHistory } from "./agent.js";
import { chatSchema, conversationsSchema, historySchema } from "./api-schema.js";

const chatRouter = new Elysia({ prefix: "/api" });

chatRouter.get("/", () => "Hello World");


chatRouter.post(
  "/chat/:conversationId?",
  async function ({
    body,
    query,
    params: { conversationId = randomUUID() },
    set,
  }) {
    const { message } = body;

    if (!message) {
      set.status = 400;
      return "Missing message";
    }
    const response = await callAgent(message, conversationId);
    return { response, conversationId };
  },
  chatSchema
);


chatRouter.get(
  "/history/:conversationId",
  async ({ params: { conversationId }, set }) => {
    set.headers["content-type"] = "application/json";
    const res = await getHistory(conversationId);
    return res;
  },
  historySchema
);


chatRouter.get("/conversations",async()=>{
  
  const conversations = await getConversations()


  return conversations

},conversationsSchema)

export default chatRouter;
