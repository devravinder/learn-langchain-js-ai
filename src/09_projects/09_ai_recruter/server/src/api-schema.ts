import { t } from "elysia";

export const chatSchema = {
  response: t.Object({
      response: t.String(),
      conversationId: t.String(),
    }),
  
  body: t.Object({
    message: t.String(),
  }),
};

export const chatMessage = t.Object({
  id: t.String(),
  role: t.UnionEnum(["human", "ai"]),
  content: t.String(),
});

export type Message = typeof chatMessage.static;

export const historySchema = {
  params: t.Object({
    conversationId: t.String(),
  }),
  response: t.Array(chatMessage)
};


export const conversationsSchema = {
  response: t.Array(t.String())
};