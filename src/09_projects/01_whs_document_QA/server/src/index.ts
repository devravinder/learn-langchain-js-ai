import { Elysia } from "elysia";

const app = new Elysia();

const PORT = process.env.PORT || 3001; 

app
.use(import("./routes"))
.all("/*", "Not Found")
.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
