import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { initilizeClient } from "./mcp_client";
import { initializeTransport } from "./sse_transport";

const url = "http://localhost:3001/mcp";

const listTools = async (client: Client) => {
  const tools = await client.listTools();
  console.log(tools);
};

const callTool = async (
  client: Client,
  name: string,
  args: Record<string, any>
) => {
  const result = await client.callTool({
    name,
    arguments: args,
  });

  console.log("result ", result);
};

// Start server
async function main() {
  const client = await initilizeClient();
  const transport = await initializeTransport(url);

  await client.connect(transport as any);

  await useClient(client)

  await transport.close();
  console.log("done");
}

const useClient = async (client: Client) => {
  await listTools(client);

  await callTool(client, "currentDate", {});

  await callTool(client, "multiple", { a: 2, b: 3 });
};

main().catch((error) => {
  process.exit(1);
});
