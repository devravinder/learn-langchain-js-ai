import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import pg from "pg";
import { StringOutputParser } from "@langchain/core/output_parsers";

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

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions in short, simple, and give precise answer",
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

const chain = prompt.pipe(model as any).pipe(new StringOutputParser());

const chatHistory = (sessionId: string) => {
  return new PostgresChatMessageHistory({
    sessionId,
    pool,
    // Can also pass `poolConfig` to initialize the pool internally,
    // but easier to call `.end()` at the end later.
  });
};

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
  getMessageHistory: async (sessionId) => chatHistory(sessionId),
});

const query = async function* (input: string, sessionId: string) {
  const streamRes = await chainWithHistory.stream(
    {
      input,
    },
    { configurable: { sessionId } }
  );

  for await (const chunk of streamRes) {
    yield chunk;
  }

  // await pool.end();
};

const getHistory = async (sessionId: string) => {
  // return chatHistory(sessionId).getMessages()

  const res = await pool.query(
    'SELECT id, session_id AS "sessionId", message FROM langchain_chat_histories WHERE session_id = $1',
    [sessionId]
  );
  return res.rows;
};

const shutdown = async () => {
  await pool.end();
}

export default {
  query,
  getHistory,
  shutdown
};
