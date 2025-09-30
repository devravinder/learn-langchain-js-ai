import { ChatOpenAI } from "@langchain/openai";


const model = new ChatOpenAI({
  model: "x-ai/grok-4-fast:free",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  temperature: 0.9,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});



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