import { Command, END, START, StateGraph } from "@langchain/langgraph";
import * as z from "zod";

//

import { drawGraph } from "./util.js";

const State = z.object({
  sum: z.number(),
});

type RagState = z.infer<typeof State>;

export const nodeOne = async (state: RagState) => {

  console.log(" in one ")
  const someChecks = state.sum === 3;
  console.log({someChecks})
  if (someChecks) {
    return new Command({
      goto: END,
      update: {
        sum: 5,
      },
    });
  }

  return {
    sum: state.sum + 1,
  };
};

export const nodeTwo = async (state: RagState) => {

  console.log(" in two ")

  return {
    sum: state.sum + 2,
  };
};

export const nodeThree = async (state: RagState) => {

  console.log(" in three ")

  return {
    sum: state.sum + 3,
  };
};

export const shouldContinue = async (state: RagState) => {
  console.log(" in shouldContinue ")

  const shouldEnd = state.sum > 10;
  if (shouldEnd) return END;


  return state.sum % 2 == 0 ? "one" : "three";
};

const workflow = new StateGraph(State)
  .addNode("one", nodeOne)
  .addNode("two", nodeTwo)
  .addNode("three", nodeThree)
  // Conecting Edges Here
  .addEdge(START, "one")
  .addEdge("one", "two")
  // .addEdge("two", "three")
  .addConditionalEdges("two", shouldContinue)
  .addEdge("three", END);

// ********************** Compile the graph
const graph = workflow.compile();

// ********************** Drawing & Output a png

await drawGraph(graph, "2nd.png");

/* 

// ********************** Invoking (With Stream)
// Invoke the graph
const res = await graph.invoke({ sum: 1 })
          // Run the entire graph once, synchronously until completion.
          // Returns the final output state (the accumulated state at END).

console.log({res})

 */

// Invoke with stream
const stream = await graph.stream({ sum: 1 });
// Run the graph step-by-step, asynchronously, and yield intermediate outputs (per node).

for await (let value of stream) {
  console.log({ value });
}
