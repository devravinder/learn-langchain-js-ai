import {
    Command,
    MemorySaver,
    START,
    END,
    StateGraph,
    interrupt,
  } from "@langchain/langgraph";
  import * as z from "zod";
  
  const State = z.object({
    generatedText: z.string().optional(),
  });
  
  const builder = new StateGraph(State)
  .addNode("jokeGenerator", (state)=>{

    // make llm call

    return ({generatedText:'javascript is java + script '})

  })
    .addNode("review", async (state) => {
      // Ask a reviewer to edit the generated content
      const updated = interrupt({
        instruction: "Review and edit this content",
        content: state.generatedText,
      });
      return { generatedText: updated };
    })
    .addEdge(START, "jokeGenerator")
    .addEdge("jokeGenerator","review")
    .addEdge("review", END);
  
  const checkpointer = new MemorySaver();
  const graph = builder.compile({ checkpointer });
  
  const config = { configurable: { thread_id: "review-42" } };
  const initial = await graph.invoke({  }, config);
  console.log(initial.__interrupt__);
  
  // Resume with the edited text from the reviewer
  const finalState = await graph.invoke(
    new Command({ resume: `Js joke: ${initial.__interrupt__[0].value.content}` }),
    config,
  );
  console.log(finalState.generatedText); // 