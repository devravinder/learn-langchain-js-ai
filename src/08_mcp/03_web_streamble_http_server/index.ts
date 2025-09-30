import { mcpServer } from "./mcp_server";
import { createStreamableServer } from "./streamable-http-server";

const streamableServer = createStreamableServer(mcpServer);

const PORT = process.env.PORT || 3001;

streamableServer.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
