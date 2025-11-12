import { t } from "elysia";

export const chatMessage = t.Object({
  id: t.String(),
  role: t.UnionEnum(["human", "ai"]),
  content: t.String(),
});

export type Message = typeof chatMessage.static;


//====
export const chatSchema = {
  body: t.Object({
    message: t.String(),
  }),
  params: t.Object({
    conversationId: t.Optional(t.String()),
  }),
  responses: t.Object({
    response: t.String(),
    conversationId: t.String(),
  }),
  detail:{
    tags:["chat"]
  }
};



export const historySchema = {
  params: t.Object({
    conversationId: t.String(),
  }),
  response: t.Array(chatMessage),
  detail:{
    tags:["chat"]
  }
};

export const conversationsSchema = {
  response: t.Array(t.String()),
  detail:{
    tags:["chat"]
  }
};

export const fileUploadSchema = {
  body: t.Object({
    file: t.File(),
  }),
  detail: {
    tags: ["files"],
    summary: "Upload a PDF file",
    description: "Upload a PDF file",
  },
  response: t.Object({
    success: t.Boolean(),
    message: t.String()
  }),
};
