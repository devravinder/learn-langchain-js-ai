import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export const initializeTransport = async (url: string) => {
  const baseUrl = new URL(url);

  const transport = new SSEClientTransport(baseUrl);

  return transport;
};

