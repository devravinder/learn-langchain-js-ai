import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ChatOllama } from "@langchain/ollama";

const messageHistories: Record<string, ChatMessageHistory> = {};

function getMessageHistory(sessionId: string): ChatMessageHistory {
  if (!(sessionId in messageHistories)) {
    messageHistories[sessionId] = new ChatMessageHistory();
  }
  return messageHistories[sessionId]!;
}

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.8, 
  baseUrl: "http://localhost:11434",
});

const ex1 = async () => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant. Keep your responses concise and friendly.",
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const chain = prompt.pipe(model);

  const withMessageHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: getMessageHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  const sessionId = 'session-1'
  const response1 = await withMessageHistory.invoke(
    { input: "My name is Alice and I love pizza" },
    { 
      configurable: { sessionId }
   }
  );

  console.log("res1 ", response1.content)

  const response2 = await withMessageHistory.invoke(
    { input: "What's my name and what do I love?" },
    { configurable: { sessionId } }
  );

  console.log("res2 ", response2.content)


  // const history = await getMessageHistory(sessionId).getMessages();
  // console.log("history ", history)


};


const start = async () => {
    await ex1();
};

start();
