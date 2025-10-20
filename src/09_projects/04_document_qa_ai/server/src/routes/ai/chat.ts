import { Elysia, sse, t } from "elysia";
import aiChatService from "../../services/aiService";

const chatRouter = new Elysia();

chatRouter.get("/chat", async function* ({ query, set }) {
  const { prompt, session=`${Date.now()}-session` } = query as { prompt: string, session: string };
  if (!prompt) {
    set.status = 400;
    return "Missing prompt";
  }

  const resIterable = aiChatService.query(prompt, session);

  for await (const chunk of resIterable) {
    yield sse(chunk.toString());
  }

  yield sse("[DONE]");
});

const historySchema = {
  params: t.Object({
    sessionId: t.String(),
  }),
};
chatRouter.get(
  "/history/:sessionId",
  ({ params: { sessionId } }) => {
    return aiChatService.getHistory(sessionId)
  },
  historySchema
);

export default chatRouter;
