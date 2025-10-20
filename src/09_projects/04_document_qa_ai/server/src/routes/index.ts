import{ Router } from 'express';
import chat from "./chat.js";

const routes: Router = Router();


routes.use("/chat", chat);
routes.all("/", (req, res)=>{
    res.send("hello")
})

export default routes;