import { QdrantVectorStore } from "@langchain/qdrant";

//
import models from "./models.js";

const { embeddingModel } = models;

export const qdrantVectorStore = async (
  collectionName: string = "pdf-documents"
) => {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddingModel,
    {
      url: process.env.QDRANT_URL,
      collectionName,
    }
  );

  return vectorStore;
};

export const vectorStore = await qdrantVectorStore();
