import { tool } from "@langchain/core/tools";
import { Command, END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import * as z from "zod";



const getUserInfo=(userId: string)=>`User with id:${userId}`

const lookupUserInfo = tool(
  async (input, config) => {
    const userId = config.configurable?.userId;
    const userInfo = getUserInfo(userId);
    return new Command({
      update: {
        userInfo: userInfo,
        messages: [{
          role: "tool",
          content: "Successfully looked up user information",
          tool_call_id: config?.toolCall?.id || "no_id"
        }]
      }
    });
  },
  {
    name: "lookupUserInfo",
    description: "Use this to look up user information to better assist them with their questions.",
    schema: z.object({}),
  }
);


//===

const Message = z.object({
    role: z.enum(["user", "assistant", "tool"]),
    content: z.string(),
    tool_call_id: z.string().optional(),
  });
  
  const State = z.object({
    messages: z.array(Message),
    userInfo: z.string().optional(),
  });


const graphBuilder = new StateGraph(State)
  .addNode("fetchUserInfo", async (state, config) => {
    console.log("[Graph] Invoking tool...");
    const result = await lookupUserInfo.invoke({}, config);
    return result.update; // Return updated state
  })
  .addEdge(START, "fetchUserInfo")
  .addEdge("fetchUserInfo", END);

const checkpointer = new MemorySaver();
const graph = graphBuilder.compile({ checkpointer });

// ---------------------------
// Run the Graph
// ---------------------------
const config = {
  configurable: { thread_id: "user-lookup-thread", userId: "1234" },
  toolCall: { id: "tool_001" },
};

const initialState = {
  messages: [{ role: "user", content: "Find my profile information" }],
};

// Invoke the graph
const result = await graph.invoke(initialState, config);

console.log("\n=== FINAL RESULT ===");
console.log(result);
console.log("\nUser Info:", result.userInfo);