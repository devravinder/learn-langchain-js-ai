import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import pg from "pg";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import {
  MessagesState,
  Annotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
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

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
});

/* const model = new ChatGroq({
    apiKey: process.env.GROK_API_KEY,
    model: "qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
    temperature: 0.9,
    maxTokens: 250,
  }); */

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (state: BaseMessage[], update: BaseMessage[]) =>
      state.concat(update),
    default: () => [],
  }),
});

async function agentNode(
  state: typeof StateAnnotation.State,
  config?: RunnableConfig
) {
  const systemPrompt =
    new SystemMessage(`You are a helpful assistant. Answer all questions in short, simple, and give precise answer.
    chcek the previous conversation for context`);
  const response = await model.invoke([systemPrompt, ...state.messages]);
  return { messages: [response] };
}

const builder = new StateGraph(StateAnnotation)
  .addNode("agent", agentNode)
  .addEdge(START, "agent")
  .addEdge("agent", END);

const checkpointSaver = new PostgresSaver(pool);

const graph = builder.compile({ checkpointer: checkpointSaver });

const query = async function* (input: string, sessionId: string) {
  const userInput = { messages: [new HumanMessage(input)] };
  const streamRes = await graph.stream(userInput, {
    configurable: { thread_id: sessionId, streamMode: "messages" },
    recursionLimit: 5,
  });

  for await (const chunk of streamRes) {
    const content = chunk.agent?.messages[0].content;
    if (content) yield content;
  }
};

async function getHistory(sessionId: string) {
  const messages = await graph.getStateHistory({ configurable: { thread_id: sessionId } })

  return messages;
}

export default {
  query,
  getHistory,
};
