import { Elysia, t } from "elysia";
import { randomUUID } from "crypto";
import { callAgent } from "./agent.js";

const chatRouter = new Elysia({ prefix: "/api" });

chatRouter.get("/",()=>"Hello World")



/* 
// API endpoint to start a new conversation
// curl -X POST -H "Content-Type: application/json" -d '{"message": "Build a team to make an iOS app, and tell me the talent gaps."}' http://localhost:3001/api/chat/123456789
    

  // API endpoint to send a message in an existing conversation
  // curl -X POST -H "Content-Type: application/json" -d '{"message": "What team members did you recommend?"}' http://localhost:3001/api/chat/123456789
   

*/

const requestSchema = {
  body: t.Object({
    message: t.String(),
  }),
};

chatRouter.post(
  "/chat/:conversationId?",
  async function* ({
    body,
    query,
    params: { conversationId = randomUUID() },
    set,
  }) {
    const { message } = body;

    if (!message) {
      set.status = 400;
      return "Missing prompt";
    }

    const response = await callAgent(message, conversationId);
    return { response, conversationId };
  },
  requestSchema
);

export default chatRouter;
