import { chatModel } from "./models.js";
import { profileSchema } from "./schema.js";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { END, START, StateGraph } from "@langchain/langgraph";


const MAX_ATTEMPTS = 3;
//===
const State = z.object({
  input: z.string(),
  // json: profileSchema.optional(),
  result: z.string(),
  isValid: z.boolean(),
  attempts: z.number(),
  error: z.string().optional(),
});

type GraphState = z.infer<typeof State>;

const parser = StructuredOutputParser.fromZodSchema(profileSchema);

const resumeParserNode = async (state: GraphState): Promise<GraphState> => {
  console.log("initial parse ");
  const prompt = PromptTemplate.fromTemplate(
    `
    You are a resume parsing expert. Convert the given resume text into structured JSON.
  Follow this exact JSON schema:
  {schema}
  
  Resume text:
  """
  {text}
  """
  Important:
- Output only valid JSON in string format — nothing else - no explanations, no suggestions, no thinking <think> </think>, no markdown stripper(no \`\`\`json\`\`\` ).
- strictly give only string that is valid json & should work JSON.parse(string)
- Ensure types match expected fields (strings, arrays, nested objects).
- If a value is unknown, you may use an empty string or empty array, but do not remove required fields.
- Do not include any text besides the JSON object.
- Keep field names identical to the schema.
- If a field is missing, add it with an empty string or empty array as appropriate.
- Keep arrays of enum values only from the provided TechStackEnum values.
    `
  );

  const chain = prompt.pipe(chatModel); // .pipe(parser)

  const res = await chain.invoke({
    schema: parser.getFormatInstructions(),
    text: state.input,
  });

  return { ...state, result: res.content as string, attempts: 1 };
};

const retryNode = async (state: GraphState): Promise<GraphState> => {
  console.log("retry node");
  const prompt = PromptTemplate.fromTemplate(`
  The previous llm response is failed to JSON parse.
  Parse the previous response to proper given schema: {schema}
  The previous response: {result}

  Important:
- Output only valid JSON in string format — nothing else (no explanations, no suggestions, no thinking).
- reove markdown stripper (no \`\`\`json\`\`\` )
- Ensure types match expected fields (strings, arrays, nested objects).
- If a value is unknown, you may use an empty string or empty array, but do not remove required fields.
- Do not include any text besides the JSON object.
- Keep field names identical to the schema.
- If a field is missing, add it with an empty string or empty array as appropriate.
- Keep arrays of enum values only from the provided TechStackEnum values.
  `);

  const chain = prompt.pipe(chatModel);

  const res = await chain.invoke({
    schema: parser.getFormatInstructions(),
    result: state.result,
  });

  return {
    ...state,
    result: res.content as string,
    attempts: (state.attempts || 0) + 1,
  };
};

const extractJsonFromMarkdown = (text: string) => {
  // Note:- depending on the model, the response will be in different format, so we need to extract the JSON part only & properly

  //  console.log("text---------->", text);

  // Extract JSON part only
  const jsonMatch = text.match(/{[\s\S]*}/);
  const jsonString = jsonMatch ? jsonMatch[0] : null;

  return jsonString;
};

const validateNode = async (state: GraphState): Promise<GraphState> => {
  console.log("validate node");
  try {
    const cleanedText = extractJsonFromMarkdown(state.result);
    if(!cleanedText) throw "No JSON found in the response";

    
    JSON.parse(cleanedText); // await parser.safeParse(cleanedText);

    console.log("validate node success");
    return { ...state, result: cleanedText, isValid: true, error: "" };
  } catch (error) {
    console.log("validate node failed");
    return { ...state, isValid: false, error: state.attempts === MAX_ATTEMPTS ? "Max attempts reached" :  "Json parsing failed" };
  }
};

const shouldContinue = (state: GraphState) => {
  if (state.attempts >= MAX_ATTEMPTS) {
    console.log("reached max attempts ");
    return END;
  }
  if (state.isValid) return END;

  return "retry";
};

//================

const workflow = new StateGraph(State)
  .addNode("parse_resume", resumeParserNode)
  .addNode("retry", retryNode)
  .addNode("validate", validateNode)
  // edges
  .addEdge(START, "parse_resume")
  .addEdge("parse_resume", "validate")
  .addEdge("retry", "validate")
  .addConditionalEdges("validate", shouldContinue);

const app = workflow.compile({});

//=====


export async function parseResume(input: string) {
  console.log("parseResume---", input)
  const {result, error} = await app.invoke({ input });
  return ({result, error});
}
