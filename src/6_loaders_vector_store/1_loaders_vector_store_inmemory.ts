import fs from "fs/promises";
import * as path from "path";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOllama({
  model: "qwen2.5:0.5b", // "qwen2.5:0.5b" won't support embedding,
  temperature: 0.8,
  baseUrl: "http://localhost:11434",
});
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text:v1.5",
  baseUrl: "http://localhost:11434",
});

const loadDocs = async (chunkSize = 100) => {
  const filePath = path.join(__dirname, "./README.md");
  const fileContent = await fs.readFile(filePath, "utf-8");

  // Text Splitter
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize,
    chunkOverlap: 20,
  });

  const docs = await textSplitter.createDocuments([fileContent]);

  return docs;
};

const getVectorStore = async () => {
  /* 
  const splitDocs = await loadDocs(500);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  ); 
  */

  const vectorStore = await new MemoryVectorStore(embeddings);

  return vectorStore;
};

const storeDocs = async () => {
  const splitDocs = await loadDocs(500);
  const vectorStore = await getVectorStore();
  vectorStore.addDocuments(splitDocs);
};

// embedding text
const ex1 = async () => {
  const res = await embeddings.embedQuery("Hello");
  console.log(res);
};

// similarity search
const ex2 = async (k = 1) => {
  const question = "who is Ravinder?";
  const vectorStore = await getVectorStore();
  const relevantDocs = await vectorStore.similaritySearch(question, k);
  console.log({ relevantDocs });

  return relevantDocs;
};

const ex3 = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the following question based only on the provided context:

        Context: {context}

        Question: {input}`);

  // to communticate & handle docs...like combining
  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const vectorStore = await getVectorStore(); // data is there

  // to get the docs
  const retrievalChain = await createRetrievalChain({
    retriever: vectorStore.asRetriever({ k: 3 }),
    combineDocsChain: documentChain,
  });

  const response = await retrievalChain.invoke({
    input: "who is Ravinder",
  });

  console.log(response.answer);
};

const start = async () => {
  await storeDocs();
  //  await ex1();
  //   await ex2(3);
  await ex3();
};

start();

/* 
While embedding:-
  - keep the chunk size more...not too much
     - so that the relavant information comes

  - try to fetch more than 1 element if required ( k=3 )
*/
