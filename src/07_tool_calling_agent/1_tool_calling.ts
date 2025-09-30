import { ChatOllama } from "@langchain/ollama";
import { currentDateTool, multiplyTool } from "./tools";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
const model = new ChatOllama({
  model: "qwen2.5:0.5b", // "qwen2.5:0.5b" won't support embedding,
  temperature: 0.8,
  baseUrl: "http://localhost:11434",
});

const tools = [
  multiplyTool,
  currentDateTool
];



// Create the prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant with access to various tools. Use the appropriate tool to answer the user's question. If you need to use a tool, call it with the correct parameters."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// Create the agent
const createAgent = async () => {
  const agent = await createToolCallingAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false, // Set to false to hide internal workings
  });

  return agentExecutor;
};

const runQuery = async (question: string) => {
  console.log(`❓ Question: ${question}`);

  const agentExecutor = await createAgent();
  
  try {
    const result = await agentExecutor.invoke({
      input: question,
    });

    console.log("\n✅ Final Answer:");
    console.log(result.output);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};


const start = async () => {
    await runQuery("multiply 2, 3");
    console.log()
    await runQuery("What is the date today");
};

start();
