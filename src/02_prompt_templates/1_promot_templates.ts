import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
});

const ex1 = async () => {
  const template = PromptTemplate.fromTemplate(
    "You are a friendly AI. Greet {name} with a joke about {topic}."
  );
  const formattedMessage = await template.format({
    name: "Ravinder",
    topic: "cats",
  });

  const res = await model.invoke(formattedMessage);

  console.log(res);
};

const start = async () => {
  await ex1();
};
start();
