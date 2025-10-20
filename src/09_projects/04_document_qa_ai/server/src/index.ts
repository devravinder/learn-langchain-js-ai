import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { node } from '@elysiajs/node'

const app = new Elysia({ adapter: node() });

const PORT = process.env.PORT || 3001; 

app
.use(cors())
.use(import("./routes"))
.all("/*", "Not Found")
.listen(PORT);

console.log(
  `🦊 Elysia is running at ${PORT}`
);
