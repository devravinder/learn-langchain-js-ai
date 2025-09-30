import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  CommaSeparatedListOutputParser,
  StringOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers";
// import { StructuredOutputParser } from "langchain/output_parsers"; // this also works
import { z } from "zod";

const model = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0.9,
  maxRetries: 2,
  baseUrl: "http://localhost:11434",
});

// StringOutputParser
const ex1 = async () => {
  const prompt = ChatPromptTemplate.fromTemplate("Tell a joke about {word}.");
  const outputParser = new StringOutputParser();

  // Create the Chain
  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({ word: "dog" });

  console.log(typeof res);
  console.log(res);
  console.log("---------------");
};

// ListOutputParser
const ex2 = async () => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Provide 5 synonyms, seperated by commas, for a word that the user will provide.",
    ],
    ["human", "{word}"],
  ]);
  const outputParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    word: "happy",
  });

  console.log(typeof res, "--", Array.isArray(res));
  console.log(res);
  console.log("---------------");
};

// StructuredOutputParser
const ex3 = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Extract information from the following phrase.\n{format_instructions}\n{phrase}"
  );

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "name of the person",
    age: "age of person",
  });

  //console.log(outputParser.getFormatInstructions())
  /* 
   ```json
       {"type":"object","properties":
         {
          "name":{"type":"string","description":"name of the person"},
          "age":{"type":"string","description":"age of person"}},
          "required":["name","age"],
          "additionalProperties":false,
          "$schema":"http://json-schema.org/draft-07/schema#"
        }
    ```
  */

  const chain = prompt.pipe(model).pipe(outputParser);

  const res = await chain.invoke({
    phrase: "Max is 30 years old",
    format_instructions: outputParser.getFormatInstructions(),
  });

  console.log(typeof res);
  console.log(res);
  console.log("---------------");
};

const ex4 = async () => {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Extract information from the following phrase.\n{format_instructions}\n{phrase}"
  );
  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      recipe: z.string().describe("name of recipe"),
      ingredients: z.array(z.string()).describe("ingredients"),
    }) as unknown as any
  );

  // Create the Chain
  const chain = prompt.pipe(model).pipe(outputParser);

  // console.log(outputParser.getFormatInstructions())
  /* 
   ```json
   {"$schema":"https://json-schema.org/draft/2020-12/schema",
    "type":"object",
    "properties":{"recipe":{"type":"string"},"ingredients":{"type":"array","items":{"type":"string"}}},
    "required":["recipe","ingredients"],"additionalProperties":false
    }
  ```
  */

  const res = await chain.invoke({
    phrase:
      "The curd rice is made using Cooked rice, curd, Green & red chillies, Seasoning (tadka), Oil, salt",
    format_instructions: outputParser.getFormatInstructions(),
  });

  console.log(typeof res);
  console.log(res);
  console.log("---------------");
};

const start = async () => {
  // await ex1();

  // await ex2();
  // await ex3();
  await ex4();
};
start();
