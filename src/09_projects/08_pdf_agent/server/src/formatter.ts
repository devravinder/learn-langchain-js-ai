import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import type { InteropZodType } from "@langchain/core/utils/types";
import type { ConfigurableModel } from "langchain/chat_models/universal";



// structured output -> text to given zod-schema format
async function formatText<T extends InteropZodType>(model:ConfigurableModel, text: string, schema: T): Promise<T> {

    const parser = StructuredOutputParser.fromZodSchema(schema);
  
    const prompt = PromptTemplate.fromTemplate(`Extract information from the following phrase.\n{format_instructions}\n{phrase}`);
  
    
    const chain = prompt.pipe(model).pipe(parser)
  
    const res = await chain.invoke({
      phrase:text,
      format_instructions: parser.getFormatInstructions(),
    });
  
    return res;
  }
  