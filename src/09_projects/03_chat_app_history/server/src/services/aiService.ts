import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import pg from "pg";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { MessagesState, Annotation } from "@langchain/langgraph";
import { AIMessageChunk } from "@langchain/core/messages"; // Added for proper typing of streamed chunks
import { RunnableConfig } from "@langchain/core/runnables"; // Added for config typing

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DB,
} = process.env;
const poolConfig = {
  host: DATABASE_HOST,
  port: parseInt(DATABASE_PORT),
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_DB,
};

const pool = new pg.Pool(poolConfig);

/* const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
}); */

const model = new ChatGroq({
    apiKey: process.env.GROK_API_KEY,
    model: "qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
    temperature: 0.9,
    maxTokens: 250,
  });


// const llm = systemPrompt.pipe(model as any).pipe(new StringOutputParser());

const checkpointSaver = new PostgresSaver(pool);
await checkpointSaver.setup();


const prrompt = `
You are a helpful assistant. As assistant answer all questions in short, simple, and give precise answer.
 Do conversation if needed, but give always short answer. Don't give your thinking<think><.think>.
`;
// React Agent is Graph the is compiled
const agent = createReactAgent({
  llm:model as any,
  tools: [],
  checkpointSaver,
  stateModifier: prrompt
});

const query = async function* (input: string, sessionId: string) {
  
  const streamRes = await agent.stream(
    { messages: [new HumanMessage(input)] },
    { 
      configurable: { thread_id: sessionId },
      streamMode: "messages",
   } 
  );

  for await (const chunk of streamRes) {
        const aiMessage = chunk[0]
        yield aiMessage.content;
    
  }
};

export default {
  query,
};
