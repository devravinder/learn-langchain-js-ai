import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";


export const initializeTransport = async (client: Client, command: string, args: string[]) => {
  const transport = new StdioClientTransport({
    command, args
  });

  return transport;
};

