import { StateGraph, START, END, MemorySaver, Command, interrupt } from "@langchain/langgraph";
import { z } from "zod";


const State = z.object({
  actionDetails: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).nullable(),
});

const graphBuilder = new StateGraph(State)
  .addNode("approval", async (state) => {
    // Expose details so the caller can render them in a UI
    const decision = interrupt({
      question: "Approve this action?",
      details: state.actionDetails,
    });
    return new Command({ goto: decision ? "proceed" : "cancel" });
  }, { ends: ['proceed', 'cancel'] })
  .addNode("proceed", () => ({ status: "approved" }))
  .addNode("cancel", () => ({ status: "rejected" }))
  .addEdge(START, "approval")
  .addEdge("proceed", END)
  .addEdge("cancel", END);

// Use a more durable checkpointer in production
const checkpointer = new MemorySaver();
const graph = graphBuilder.compile({ checkpointer });

const config = { configurable: { thread_id: "approval-123" } };


const initial = await graph.invoke(
  { actionDetails: "Transfer $500", status: "pending" },
  config,
);
console.log(initial.__interrupt__); // this is the arguments passed to interrupt // [{value: { question: 'Approve this action?', details: 'Transfer $500' }}]

// Resume with the decision; true routes to proceed, false to cancel
const resumed = await graph.invoke(new Command({ resume: true }), config);
console.log(resumed.status); // -> "approved"