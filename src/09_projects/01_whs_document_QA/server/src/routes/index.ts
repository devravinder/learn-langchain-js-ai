import { Elysia } from "elysia";

const userRoutes = new Elysia({ prefix: "/user" })
  .get("/sign-in", "Sign in")
  .post("/sign-up", "Sign up")
  .post("/profile", "Profile");

const routes = new Elysia({ prefix: "/api" })
  .use(userRoutes)
  .get("/", "hello world")
  .all("/*", "Not Found");

  export default routes;