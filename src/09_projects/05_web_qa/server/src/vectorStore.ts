import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { QdrantVectorStore } from "@langchain/qdrant";

//
import { embeddingModel } from "./models.js";
import type { Document } from "@langchain/core/documents";
import type { VectorStore } from "@langchain/core/vectorstores";

const loadDocs = async () => {
  const urls = [
    "https://lilianweng.github.io/posts/2023-06-23-agent/",
    "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
    "https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/",
  ];

  const docs = await Promise.all(
    urls.map((url) => new CheerioWebBaseLoader(url).load())
  );

  const docsList = docs.flat();

  return docsList;
};

const splitDocs = async (docsList: Document<Record<string, any>>[]) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docSplits = await textSplitter.splitDocuments(docsList);

  return docSplits;
};

const initData = async (vectorStore: VectorStore) => {
  const docsList = await loadDocs();
  const docSplits = await splitDocs(docsList);

  console.log("=========docs loaded")

  await vectorStore.addDocuments(docSplits);

  console.log("====docs stored")
};

export const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddingModel,
  {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing",
  }
);


// only one time
// await initData(vectorStore)