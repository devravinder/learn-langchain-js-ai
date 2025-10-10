import { Client } from "@modelcontextprotocol/sdk/client/index.js";


export const initilizeClient = async () => {
  const client = new Client({
    name: "example-client",
    version: "1.0.0",
  });

  return client;
};
