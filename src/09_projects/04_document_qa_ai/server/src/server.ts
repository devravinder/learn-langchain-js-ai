import express from "express";
import routes from "./routes/index.js";
import cors from 'cors'

const app = express();

app.use(cors())
app.use("/api", routes);

export const startServer = async (PORT: string | number = 3001) => {
  app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });
};
