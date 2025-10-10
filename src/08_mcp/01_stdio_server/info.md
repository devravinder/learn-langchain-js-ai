

## Note:-
1. MCP servers are not related to langchain, they are seperate
   - in this example, we are creating a simple MCP server with one tool


## Usage
1. run inspector
   - `npx @modelcontextprotocol/inspector@latest`
   - or `pnpm run s:i`

2. open the inpsector UI in the browser
     - add 
       - Transport Type: `STDIO`
       - command: `tsx`
       - Argumets: `--no-warnings  /home/ravinder/Drive/work-spaces/js_nodejs/learn-langchain-js-ai/src/08_mcp/01_stdio_server/index` 
           - if needed change the file path

     - connect
     - then navigate to `tools`
         - `list tools`


3. to run as js
  1. build
    - `npx tsc src/08_mcp/01_stdio_server/index.ts --outDir dist --module nodenext --moduleResolution nodenext`
    - or `pnpm run 8:1:build`

  2. from the stdio add
     - add 
       - Transport Type: `STDIO`
       - command: `node`
       - Argumets: `/home/ravinder/Drive/work-spaces/js_nodejs/learn-langchain-js-ai/dist/index.js` 
           - if needed change the file path