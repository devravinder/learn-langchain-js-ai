import { startStudioServer } from "./studio_server";
import { mcpServer } from "./mcp_server";

// Start server
async function main() {
  await startStudioServer(mcpServer);
}

main().catch((error) => {
  process.exit(1);
});
