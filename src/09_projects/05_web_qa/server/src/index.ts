import { createRetrieverTool } from "@langchain/classic/tools/retriever";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage, ToolMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";
import { StateGraph, START, END, MessagesZodMeta } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";

//
import { chatModel } from "./models.js";
import { vectorStore } from "./vectorStore.js";


const GraphState = z.object({
    messages: z.array(z.custom<BaseMessage>()).register(registry, MessagesZodMeta),
    route: z.string().optional(),
  });

type RagState = z.infer<typeof GraphState>


console.log("----1----");

const retriever = vectorStore.asRetriever();

const tool = createRetrieverTool(retriever, {
  name: "retrieve_blog_posts",
  description:
    "Search and return information about Lilian Weng blog posts on LLM agents, prompt engineering, and adversarial attacks on LLMs.",
});
const tools = [tool];

//===================
console.log("----3----");

async function generateQueryOrRespond(state:RagState ) {
  const { messages } = state;
  const model = chatModel.bindTools(tools);

  const response = await model.invoke(messages);
  return {
    messages: [response],
  };
}
//================
console.log("----4----");

const prompt = ChatPromptTemplate.fromTemplate(
  `You are a grader assessing relevance of retrieved docs to a user question.
  Here are the retrieved docs:
  \n ------- \n
  {context}
  \n ------- \n
  Here is the user question: {question}
  If the content of the docs are relevant to the users question, score them as relevant.
  Give a binary score 'yes' or 'no' score to indicate whether the docs are relevant to the question.
  Yes: The docs are relevant to the question.
  No: The docs are not relevant to the question.`
);

const gradeDocumentsSchema = z.object({
  binaryScore: z.string().describe("Relevance score 'yes' or 'no'"),
});

async function gradeDocuments(state:RagState) {
  const { messages } = state;

  const model = chatModel.withStructuredOutput(gradeDocumentsSchema);

  const chain = prompt.pipe(model);

  const score = await chain.invoke({
    question: messages.at(0)?.content,
    context: messages.at(-1)?.content,
  });

/*   if (score.binaryScore === "yes") {
    return "generate";
  }
  return "rewrite"; */

  return {
    messages: messages,
    route: score.binaryScore === "yes" ? "generate" : "rewrite",
  };
}
//=====================
console.log("---5---");

const rewritePrompt = ChatPromptTemplate.fromTemplate(
  `Look at the input and try to reason about the underlying semantic intent / meaning. \n
  Here is the initial question:
  \n ------- \n
  {question}
  \n ------- \n
  Formulate an improved question:`
);

async function rewrite(state:RagState) {
  const { messages } = state;
  const question = messages.at(0)?.content;

  const model = chatModel;

  const response = await rewritePrompt.pipe(model).invoke({ question });
  return {
    messages: [response],
  };
}
//====================
console.log("---6---");

async function generate(state:RagState) {
  const { messages } = state;
  const question = messages.at(0)?.content;
  const context = messages.at(-1)?.content;

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are an assistant for question-answering tasks.
      Use the following pieces of retrieved context to answer the question.
      If you don't know the answer, just say that you don't know.
      Use three sentences maximum and keep the answer concise.
      Question: {question}
      Context: {context}`
  );

  const ragChain = prompt.pipe(chatModel);

  const response = await ragChain.invoke({
    context,
    question,
  });

  return {
    messages: [response],
  };
}

//==================
console.log("---7---")


// Create a ToolNode for the retriever
const toolNode = new ToolNode(tools);

// Helper function to determine if we should retrieve
function shouldRetrieve(state:RagState) {
  const { messages } = state;
  const lastMessage = messages.at(-1);

  if (AIMessage.isInstance(lastMessage) && lastMessage?.tool_calls?.length) {
    return "retrieve";
  }
  return END;
}


// Define the graph
const builder = new StateGraph(GraphState)
  .addNode("generateQueryOrRespond", generateQueryOrRespond)
  .addNode("retrieve", toolNode)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("rewrite", rewrite)
  .addNode("generate", generate)
  // Add edges
  .addEdge(START, "generateQueryOrRespond")
  // Decide whether to retrieve
  .addConditionalEdges("generateQueryOrRespond", shouldRetrieve)
  .addEdge("retrieve", "gradeDocuments")
  // Edges taken after grading documents
  .addConditionalEdges(
    "gradeDocuments",
    // Route based on grading decision
    (state) => state.route
  )
  .addEdge("generate", END)
  .addEdge("rewrite", "generateQueryOrRespond");

// Compile
const graph = builder.compile();

//=================

console.log("---start---");

const ex = async () => {
  const input = { messages: [new HumanMessage("hello!")] };
  const result = await generateQueryOrRespond(input);
  console.log(result.messages[0]);
};

const ex1 = async () => {
  const input = {
    messages: [
      new HumanMessage(
        "What does Lilian Weng say about types of reward hacking?"
      ),
    ],
  };
  const result = await generateQueryOrRespond(input);
  console.log(result.messages[0]);
};

const ex2 = async () => {
  const input = {
    messages: [
      new HumanMessage(
        "What does Lilian Weng say about types of reward hacking?"
      ),
    ],
  };
  const result = await generateQueryOrRespond(input);
  console.log(result.messages[0]);
};

const ex3 = async () => {
  const input = {
    messages: [
      new HumanMessage(
        "What does Lilian Weng say about types of reward hacking?"
      ),
      new AIMessage({
        tool_calls: [
          {
            type: "tool_call",
            name: "retrieve_blog_posts",
            args: { query: "types of reward hacking" },
            id: "1",
          },
        ],
      }),
      new ToolMessage({
        content:
          "reward hacking can be categorized into two types: environment or goal misspecification, and reward tampering",
        tool_call_id: "1",
      }),
    ],
  };
  const result = await gradeDocuments(input);

  console.log(result);
};

const ex4 = async () => {
  const input = {
    messages: [
      new HumanMessage(
        "What does Lilian Weng say about types of reward hacking?"
      ),
      new AIMessage({
        content: "",
        tool_calls: [
          {
            id: "1",
            name: "retrieve_blog_posts",
            args: { query: "types of reward hacking" },
            type: "tool_call",
          },
        ],
      }),
      new ToolMessage({ content: "meow", tool_call_id: "1" }),
    ],
  };

  const response = await rewrite(input);
  console.log(response.messages[0]?.content);
};

const ex5 = async () => {
  const input = {
    messages: [
      new HumanMessage(
        "What does Lilian Weng say about types of reward hacking?"
      ),
      new AIMessage({
        content: "",
        tool_calls: [
          {
            id: "1",
            name: "retrieve_blog_posts",
            args: { query: "types of reward hacking" },
            type: "tool_call",
          },
        ],
      }),
      new ToolMessage({
        content:
          "reward hacking can be categorized into two types: environment or goal misspecification, and reward tampering",
        tool_call_id: "1",
      }),
    ],
  };

  const response = await generate(input);
  console.log(response.messages[0].content);
};

const ex6=async()=>{

    const inputs = {
      messages: [
        new HumanMessage("What does Lilian Weng say about types of reward hacking?")
      ]
    };
    
    for await (const output of await graph.stream(inputs)) {
      for (const [key, value] of Object.entries(output)) {
        const lastMsg = output[key]?.messages[output[key].messages.length - 1];
        console.log(`Output from node: '${key}'`);
        console.log({
          type: lastMsg._getType(),
          content: lastMsg.content,
          tool_calls: lastMsg.tool_calls,
        });
        console.log("---\n");
      }
    }
}
await ex6();
