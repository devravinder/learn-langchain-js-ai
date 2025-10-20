
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
  Annotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import { AIMessageChunk } from "@langchain/core/messages"; // Added for proper typing of streamed chunks
import type { RunnableConfig } from "@langchain/core/runnables"; // Added for config typing
import {model} from './models.js'


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

  if(true)
     yield "<think>\nOkay, the user asked for a Java joke. Let me think of one I know. Java is known for being a statically typed language with a lot of syntax. Maybe something about how everything is a class. Oh, here's one: Why did the Java programmer stay outside? Because he couldn't find the main method! That's a classic because in Java, the main method is required for the program to run, and \"main method\" is also literal. Let me make sure there's no typo. Yeah, that works. It's short and to the point, fits the requirements.\n</think>\n\nWhy did the Java programmer stay outside?  \nBecause he couldn't find the `main` method! 😄"

  return

  const userInput = { messages: [new HumanMessage(input)] };
  const streamRes = await graph.stream(userInput, {
    configurable: { thread_id: sessionId, streamMode: "messages" },
    recursionLimit: 5,
  });

  for await (const chunk of streamRes) {
    const content = chunk.agent?.messages?.[0].content;
    console.log("---",chunk,"===")
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
