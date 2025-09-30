import { z } from "zod";
import { tool } from "@langchain/core/tools";

const multiplyToolSchema = z.object({
  a: z.number().describe("The first number to multiply."),
  b: z.number().describe("The second number to multiply."),
}).describe("A tool for multiplying two numbers, used when the AI needs to calculate a product.");

// Main multiply function
const multiply = ({ a, b }: { a: number; b: number }): string => {
  console.log(`🤖 Tool Called: multiply(a=${a}, b=${b})`);
  return (a * b).toString();
};



function getCurrentDateTime(): string {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // 12-hour clock
    timeZoneName: "short",
  };

  console.log("called getCurrentDateTime")

  return now.toLocaleDateString("en-IN", options);
}


export const currentDateTool = tool(
   async()=>{
   return getCurrentDateTime();
   },
  {
    name: "currentDate",
    description: "Gives current date",
    schema: z.object({}).describe(" tool to get current date")
  }
);

export const multiplyTool = tool(
   multiply as any,
  {
    schema: multiplyToolSchema,
    name: "multiply",
    description: "Multiplies two numbers together",
  }
);

// await multiplyTool.invoke({a:2, b:2})