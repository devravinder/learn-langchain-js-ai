import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";

const start = () => {
  const app = new Elysia({ adapter: node() });

  const PORT = process.env.PORT || 3001;

  app
  .use(cors())
  .use(import("./router.js"))
  .all("/*", "Not Found")
  .listen(PORT);

  console.log(`🦊 Elysia is running at ${PORT}`);
};

const setup = async () => {
   console.log(" some setup ")
};



setup()
.then(start)
.catch(()=>{
  console.log("error")
  process.exit()
})
