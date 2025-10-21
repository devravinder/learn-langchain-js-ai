import { Elysia, sse, t } from "elysia";
import aiChatService from "../../services/aiService";
import { randomUUID } from "crypto";

const chatRouter = new Elysia();

chatRouter.get(
  "/chat/:conversationId?",
  async function* ({ body, query, params: { conversationId = randomUUID() }, set }) {
    const { prompt } = query as { prompt: string };

    if (!prompt) {
      set.status = 400;
      return "Missing prompt";
    }

    const res = await aiChatService.query(prompt, conversationId);
    return {content: res, conversationId}
  }
);

const historySchema = {
  params: t.Object({
    conversationId: t.String(),
  }),
};
chatRouter.get(
  "/history/:conversationId",
  ({ params: { conversationId } }) => {
    return aiChatService.getHistory(conversationId);
  },
  historySchema
);

export default chatRouter;
