import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod/v3";

const mcpServer = new McpServer(
  {
    name: "mcp-sse-server",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

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

  return now.toLocaleDateString("en-IN", options);
}

mcpServer.registerTool(
  "currentDate",
  {
    title: "Current Date",
    description: "Gives current date",
    inputSchema: {},
  },
  async ({}) => {
    const result = getCurrentDateTime();
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }
);

const multiply = (a: number, b: number) => a * b;

mcpServer.registerTool(
  "multiple",
  {
    title: "Multiply",
    description: "Multiplies two numbers",
    inputSchema: {
      a: z.number(),
      b: z.number(),
    },
  },
  async ({ a, b }) => {
    const result = multiply(a, b);
    return {
      content: [
        {
          type: "text",
          text: `The result is ${result}`,
        },
      ],
    };
  }
);

export { mcpServer };
