
import { QdrantVectorStore } from "@langchain/qdrant";

//
import models from "./models.js";

const { embeddingModel } = models;


export const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddingModel,
  {
    url: process.env.QDRANT_URL,
    collectionName: "employees",
  }
);
