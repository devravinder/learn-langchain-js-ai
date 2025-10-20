import pg from "pg";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import {
  Annotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";

import { model } from "./model";

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
  const messages = await graph.getStateHistory({
    configurable: { thread_id: sessionId },
  });

  return messages;
}

export default {
  query,
  getHistory,
};
