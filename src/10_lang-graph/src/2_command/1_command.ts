import { StateGraph, START, Command } from "@langchain/langgraph";
import * as z from "zod";
import { drawGraph } from "../util.js";

const State = z.object({
  foo: z.string(),
});


const nodeA = (state: z.infer<typeof State>): Command => {
  console.log("Called A");
  const value = Math.random() > 0.5 ? "b" : "c";

  const goto = value === "b" ? "nodeB" : "nodeC";

  return new Command({
    // this is the state update
    update: { foo: value },
    // this is a replacement for an edge
    goto,
  });
};

const nodeB = (state: z.infer<typeof State>) => {
  console.log("Called B");
  return { foo: state.foo + "b" };
};

const nodeC = (state: z.infer<typeof State>) => {
  console.log("Called C");
  return { foo: state.foo + "c" };
};

//===
const graph = new StateGraph(State)
  .addNode("nodeA", nodeA, {
    ends: ["nodeB", "nodeC"],
  })
  .addNode("nodeB", nodeB)
  .addNode("nodeC", nodeC)
  .addEdge(START, "nodeA")
  .compile();

//=====

// await drawGraph(graph, "./2_command/1_command.png")


//===

const result = await graph.invoke({ foo: "" });
console.log(result);
