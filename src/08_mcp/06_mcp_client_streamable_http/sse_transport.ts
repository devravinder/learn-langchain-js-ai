import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export const initializeTransport = async (url: string) => {
  const baseUrl = new URL(url);

  const transport = new StreamableHTTPClientTransport(baseUrl);

  return transport;
};

