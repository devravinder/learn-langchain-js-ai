import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as readline from "node:readline/promises";

const model = new ChatGroq({
  apiKey: process.env.GROK_API_KEY,
  model: "qwen/qwen3-32b", // gemma2-9b-it, llama-3.1-8b-instant, openai/gpt-oss-120b
  temperature: 0.9,
  maxTokens: 250,
});

const ex1 = async () => {
  const messages = [
    new SystemMessage("Translate the following from English into Telugu"),
    new HumanMessage("How are You?"),
  ];

  const res = await model.invoke(messages);
  console.log(res.content);
};

//===

const ex2 = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function chat() {
    let input: string = "";

    input = await rl.question("You: ");
    if (input.toLocaleLowerCase() === "exit") {
      rl.close();
      return;
    }
    const messages = [new HumanMessage(input)];
    const response = await model.invoke(messages); // Or model.stream() for streaming
    console.log("Grok: ", response.content);

    chat();
  }

  console.log("Chat app started! Type 'exit' to quit.");
  chat();
};

//===

const ex3 = async () => {
  const resStream = await model.stream([
     {role:'system',content:"Just give what user asked, don't give your thinking"},
    { role: "user", content: "tell me a simple joke in less than 20 words" },
  ]);

  for await (const chunk of resStream) {
    // console.log(chunk.content)
    process.stdout.write(chunk.content as string)
  }
};

const start = async () => {
  // await ex1();
  // await ex2();
  await ex3();
};
start();
