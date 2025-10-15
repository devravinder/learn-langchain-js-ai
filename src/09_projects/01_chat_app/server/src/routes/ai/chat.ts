import { Elysia, sse } from "elysia";
import { model } from "../../services/aiService";

const chatRouter = new Elysia();

chatRouter.get("/chat", async function* ({ query, set }) {
  const { prompt } = query as { prompt: string };
  if (!prompt) {
    set.status = 400;
    return "Missing prompt";
  }

  const messages = [
    {
      role: "system",
      content:
        "Just give what user asked, don't give your thinking <think></think>",
    },
    { role: "user", content: prompt },
  ];
  const streamRes = await model.stream(messages);

  for await (const chunk of streamRes) {
    yield sse(chunk.content as string);
  }
  yield sse("[DONE]");
});

export default chatRouter;
