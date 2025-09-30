import { ChatOllama } from "@langchain/ollama";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.8, // Slightly lower temperature for better factual recall of history
  baseUrl: "http://localhost:11434",
});


// fresh conversation
const ex1 = async () => {
  const memory = new BufferMemory({
    memoryKey: "history",
    
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    verbose: false, // Set to true to see the full prompt sent to Ollama (including history)
  });

  const response1 = await chain.invoke({
    input:
      "My name is Elara and I live in Oslo. My favorite thing to do is paint.",
  });

  console.log(`----AI: ${response1.response}`);

  const response2 = await chain.invoke({
    input: "What city do I live in, and what is my favorite activity?",
  });

  console.log(`---AI: ${response2.response}`);

  //   const memoryVariables = await memory.loadMemoryVariables({});
  //   console.log(memoryVariables);
};

// Pre-loaded History
const ex2 = async () => {
  const initialMessages = [
    new HumanMessage(
      "My name is Elara and I live in Oslo. My favorite thing to do is paint."
    ),
    new AIMessage(
      "Hello! It sounds like you have a great passion for painting. Have you had any particular experiences or inspirations that have influenced your art?"
    ),
  ];
  const chatHistory = new ChatMessageHistory(initialMessages);

  const memory = new BufferMemory({
    memoryKey: "history",
    chatHistory,
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    verbose: false,
  });

  const response2 = await chain.invoke({
    input: "What city do I live in, and what is my favorite activity?",
  });

  console.log(`---AI (ex2): ${response2.response}`);
};

// Pre-loaded History

const ex3 = async () => {
  const memory = new BufferMemory({
    memoryKey: "history",
  });

  await memory.chatHistory.addMessage(
    new HumanMessage(
      "My name is Elara and I live in Oslo. My favorite thing to do is paint."
    )
  );

  await memory.chatHistory.addMessage(
    new AIMessage(
      "Hello! It sounds like you have a great passion for painting. Have you had any particular experiences or inspirations that have influenced your art?"
    )
  );

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    verbose: false,
  });

  const response2 = await chain.invoke({
    input: "What city do I live in, and what is my favorite activity?",
  });

  console.log(`---AI (ex3): ${response2.response}`);
};

const start = async () => {
  //   await ex1();
//   await ex2();
  await ex3();
};

start();
