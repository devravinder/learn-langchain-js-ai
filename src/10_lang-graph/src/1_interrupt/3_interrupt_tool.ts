import { tool } from "@langchain/core/tools";
import {
  Command,
  MemorySaver,
  START,
  END,
  StateGraph,
  interrupt,
} from "@langchain/langgraph";
import {z} from "zod";
import { grokLlm } from "../models.js";

const emailSchema = z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
  })


type EmailPayload = z.infer<typeof emailSchema>

const sendEmailTool = tool(
  async ({ to, subject, body }:EmailPayload) => {
    // Pause before sending; payload surfaces in result.__interrupt__

    console.log("----before------")
    const response = interrupt({
      action: "send_email",
      to,
      subject,
      body,
      message: "Approve sending this email?",
    });

    console.log("----after----")

    if (response?.action === "approve") {
      const finalTo = response.to ?? to;
      const finalSubject = response.subject ?? subject;
      const finalBody = response.body ?? body;
      console.log("[sendEmailTool]", finalTo, finalSubject, finalBody);
      return `Email sent to ${finalTo}`;
    }
    return "Email cancelled by user";
  },
  {
    name: "send_email",
    description: "Send an email to a recipient",
    schema: emailSchema,
  },
);

const model = grokLlm.bindTools([sendEmailTool]);

const Message = z.object({
  role: z.enum(["user", "assistant", "tool"]),
  content: z.string(),
});

const State = z.object({
  messages: z.array(Message),
});

const graphBuilder = new StateGraph(State)
  .addNode("agent", async (state) => {
    // LLM may decide to call the tool; interrupt pauses before sending
    const response = await model.invoke(state.messages);
    return { messages: [...state.messages, response] };
  })
  .addEdge(START, "agent")
  .addEdge("agent", END);

const checkpointer = new MemorySaver();
const graph = graphBuilder.compile({ checkpointer });

const config = { configurable: { thread_id: "email-workflow" } };
const initial = await graph.invoke(
  {
    messages: [
      { role: "user", content: "Send an email to alice@example.com about the meeting" },
    ],
  },
  config,
);
console.log(initial.__interrupt__); // -> [{ value: { action: 'send_email', ... } }]

// Resume with approval and optionally edited arguments
const resumed = await graph.invoke(
  new Command({
    resume: { action: "approve", subject: "Updated subject" },
  }),
  config,
);

console.log("===============")
console.log(resumed.messages.at(-1)); // -> Tool result returned by send_email