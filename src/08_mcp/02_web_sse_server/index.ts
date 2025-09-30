import { mcpServer } from "./mcp_server";
import { createSSEServer } from "./sse-server";

const sseServer = createSSEServer(mcpServer);

const PORT = process.env.PORT || 3001
sseServer.listen(PORT,()=>{
    console.log(`App started on port ${PORT}`)
});