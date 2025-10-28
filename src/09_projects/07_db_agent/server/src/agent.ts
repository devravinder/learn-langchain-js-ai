import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  StateGraph,
  START,
  END,
  MemorySaver,
  MessagesZodMeta,
} from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

//==
import { vectorStore } from "./vectorStore.js";
import models from "./models.js";

const { chatModel } = models;

const GraphState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta as any),
});

type RagState = z.infer<typeof GraphState>;

// Define the graph state

// Define the tools for the agent to use
const employeeLookupTool = tool(
  async ({ query, n = 10 }) => {
    console.log("Employee lookup tool called");

    const result = await vectorStore.similaritySearchWithScore(query, n);
    return JSON.stringify(result);
  },
  {
    name: "employee_lookup",
    description: "Gathers employee details from the HR database",
    schema: z.object({
      query: z.string().describe("The search query"),
      n: z
        .number()
        .optional()
        .default(10)
        .describe("Number of results to return"),
    }),
  }
);

const tools = [employeeLookupTool];

// We can extract the state typing via `GraphState.State`
const toolNode = new ToolNode<RagState>(tools);

const model = chatModel.bindTools(tools);

// Define the function that determines whether to continue or not
function shouldContinue(state: RagState) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return END;
}

// Define the function that calls the model
async function callModel(state: RagState) {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
    ],
    new MessagesPlaceholder("messages"),
  ]);

  const formattedPrompt = await prompt.formatMessages({
    system_message: "You are helpful HR Chatbot Agent.",
    time: new Date().toISOString(),
    tool_names: tools.map((tool) => tool.name).join(", "),
    messages: state.messages,
  });

  const result = await model.invoke(formattedPrompt);

  return { messages: [result] };
}

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  // edges
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

const checkpointer = new MemorySaver();

const app = workflow.compile({ checkpointer });
export async function callAgent(query: string, thread_id: string) {
  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  );

  return finalState.messages[finalState.messages.length - 1]?.content;
}
