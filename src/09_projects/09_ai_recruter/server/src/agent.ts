import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  type MessageStructure,
  type MessageType,
} from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StateGraph, START, END, MessagesZodMeta } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

//==
import { vectorStore } from "./vectorStore.js";
import models from "./models.js";
import type { Message } from "./api-schema.js";
import { checkpointSaver } from "./checkpointSaver.js";

const { chatModel } = models;

const GraphState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta as any),
});

type RagState = z.infer<typeof GraphState>;

// Define the graph state

// Define the tools for the agent to use
const developerLookupTool = tool(
  async ({ query, n = 10 }) => {
    console.log("Developer lookup tool called");

    const result = await vectorStore.similaritySearchWithScore(query, n);
    return JSON.stringify(result);
  },
  {
    name: "developer_lookup",
    description: "Gathers developer details from the database",
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

const tools = [developerLookupTool];

// We can extract the state typing via `GraphState.State`
const toolNode = new ToolNode<RagState>(tools);

const model = chatModel.bindTools(tools);

// Define the function that determines whether to continue or not
const shouldContinue = (state: RagState) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  // if the last message is tool call
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return END;
};

// Define the function that calls the model
const callModel = async (state: RagState) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question.
       If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. 
       Execute what you can to make progress. 
       If you or any of the other assistants have the final answer or deliverable,
       prefix your response with FINAL ANSWER so the team knows to stop. 
        You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
    ],
    new MessagesPlaceholder("messages"),
  ]);

  const formattedPrompt = await prompt.formatMessages({
    system_message: "You are helpful HR Recruter Chatbot Agent.",
    time: new Date().toISOString(),
    tool_names: tools.map((tool) => tool.name).join(", "),
    messages: state.messages,
  });

  const result = await model.invoke(formattedPrompt);

  return { messages: [result] };
};

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  // edges
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

const app = workflow.compile({ checkpointer: checkpointSaver });

export async function callAgent(
  query: string,
  thread_id: string,
  user_id: string = "default_user"
) {
  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id, user_id } }
  );

  return finalState.messages[finalState.messages.length - 1]?.content as string;
}
export const getMessages = async (
  thread_id: string,
  user_id: string = "default_user"
): Promise<BaseMessage[]> => {
  const snapshot = await app.getState({ configurable: { thread_id, user_id } });
  return snapshot?.values?.messages ?? [];
};

const filterConvesationMessages = (
  messages: BaseMessage<MessageStructure, MessageType>[]
) => {
  // human & final response
  return messages.filter((msg): msg is HumanMessage | AIMessage => {
    if (msg instanceof HumanMessage) return true;
    if (
      msg instanceof AIMessage &&
      (!msg.tool_calls || msg.tool_calls.length === 0)
    )
      return true;
    return false;
  });
};

export const getHistory = async (
  thread_id: string,
  user_id: string = "default_user"
): Promise<Message[]> => {
  const messages = await getMessages(thread_id, user_id);

  const filteed = filterConvesationMessages(messages);

  return filteed.map((msg) => ({
    id: msg.id!,
    role: msg instanceof HumanMessage ? "human" : "ai",
    content:
      typeof msg.content === "string"
        ? msg.content
        : JSON.stringify(msg.content),
  }));
};

export const getConversations = async (user_id: string = "default_user") => {

  // this is not efficient, we can use db queries directly instead of this

  const checkpoints = await checkpointSaver.list({ configurable: { user_id } });

  const threads = new Set<string>();

  for await (const tuple of checkpoints) {
    threads.add(tuple.config.configurable?.thread_id);
  }
  return [...threads]
};
