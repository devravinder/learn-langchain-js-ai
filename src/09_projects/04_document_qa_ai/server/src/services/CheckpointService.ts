import pg from "pg";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_DB,
  } = process.env;
  const poolConfig = {
    host: DATABASE_HOST,
    port: parseInt(DATABASE_PORT),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_DB,
  };

class CheckpointService{
   
    readonly pool;
    readonly checkpointSaver;
    constructor(){
        this.pool = new pg.Pool(poolConfig);
        this.checkpointSaver = new PostgresSaver(this.pool);
    }

    async init(){
      await this.checkpointSaver.setup()
    }
    getCheckpointer(){
      return this.checkpointSaver;
    }
    async close() {
      await this.pool.end();
    }
}


export default CheckpointService