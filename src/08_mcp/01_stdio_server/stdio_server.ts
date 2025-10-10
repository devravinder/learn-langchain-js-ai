import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";


export async function startStudioServer(mcpServer: McpServer) {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}