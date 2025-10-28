import path from "path";
import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const drawGraph = async (graph: any, name: string) => {
  // print the graph
  const drawableGraph = await graph.getGraphAsync();
  const png = await drawableGraph.drawMermaidPng();

  const arrayBuffer = await png.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(path.join(__dirname, name), buffer);
};
