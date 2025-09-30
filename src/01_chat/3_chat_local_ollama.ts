import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434"
});

const ex3 = async () => {
  const resStream = await model.stream([
    { role: "system", content: "Just give what user asked, don't give your thinking" },
    { role: "user", content: "tell me a simple joke in less than 20 words" },
  ]);

  for await (const chunk of resStream) {
    process.stdout.write(chunk.content as string);
  }
};

const start = async () => {
  await ex3();
};
start();