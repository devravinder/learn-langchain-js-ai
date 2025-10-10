import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { initilizeClient } from "./mcp_client";
import { initializeTransport } from "./stdio_transport";

const tsx  = {
    command: 'tsx',
    args:[
  "--no-warnings",
  "/home/ravinder/Drive/work-spaces/js_nodejs/learn-langchain-js-ai/src/08_mcp/01_stdio_server/index",
]
}
const nodeJs = {
    command: 'node',
    args:[
        "/home/ravinder/Drive/work-spaces/js_nodejs/learn-langchain-js-ai/dist/index.js"
    ]
}

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
  const transport = await initializeTransport(client, nodeJs.command, nodeJs.args);
//   const transport = await initializeTransport(client, tsx.command, tsx.args);

  await client.connect(transport);

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
