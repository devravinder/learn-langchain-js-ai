import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
});

const ex1 = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Context: {context}\nQuestion: {question}\nAnswer:"
  );


  const chain = prompt.pipe(model);
  const res = await chain.invoke({
    context: "Elon Musk founded xAI, its another name is Grok, an artificial intelligence company, to advance safe AI research and create transparent systems benefiting humanity.",
    question: "What is Grok?",
  });

  console.log(typeof res);
  console.log(res.content);
  console.log("---------------");
};

const start = async () => {

  await ex1();
};
start();
