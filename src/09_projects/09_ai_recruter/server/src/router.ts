import { Elysia } from "elysia";
import { randomUUID } from "crypto";
import mime from 'mime/lite';

import { callAgent, getConversations, getHistory } from "./agent.js";
import {
  chatSchema,
  conversationsSchema,
  fileUploadSchema,
  historySchema,
} from "./api-schema.js";
import { loadPdfAsSingleDocument } from "./loaders/pdf-loader.js";
import { vectorStore } from "./vectorStore.js";
import { bufferToBlob } from "./loaders/loader-util.js";
import { loadTextAsSigleDoc } from "./loaders/text-loader.js";

const chatRouter = new Elysia({ prefix: "/api" });

chatRouter.get("/", () => "Hello World");

chatRouter.post(
  "/chat/:conversationId?",
  async ({ body, params, set }) => {
    const { message } = body;

    const { conversationId = randomUUID() } = params;

    if (!message) {
      set.status = 400;
      throw "Missing message";
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

chatRouter.get(
  "/conversations",
  async () => {
    const conversations = await getConversations();

    return conversations;
  },
  conversationsSchema
);

const allowedTypes = [
  mime.getType(".md"),
  mime.getType(".pdf"),
  mime.getType(".txt"),
];

// we can store in temp file & asynchrnosly, we can convert to vector document
chatRouter.post(
  "/upload",
  async ({ body: { file }, set }) => {
    const type = file.type;

    if (!allowedTypes.includes(type)) {
      set.status = 400;
      throw "Fily type not allowed";
    }

    const arrayBuffer = await file.arrayBuffer();

    const document =
      type === mime.getType(".pdf")
        ? await await loadPdfAsSingleDocument(bufferToBlob(arrayBuffer))
        : await loadTextAsSigleDoc(bufferToBlob(arrayBuffer));

    await vectorStore.addDocuments([document]);

    // const buffer = Buffer.from(arrayBuffer);
    // const tempFilePath = "./temp-uploaded-file.pdf";
    // writeFileSync(tempFilePath, buffer);

    return { message: "File uploaded successfully", success: true };
  },
  fileUploadSchema
);

export default chatRouter;
