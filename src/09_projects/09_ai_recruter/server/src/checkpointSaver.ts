import pg from "pg";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { BaseCheckpointSaver, MemorySaver } from "@langchain/langgraph";

const postgresCheckpointer = async () => {
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

  const pool = new pg.Pool(poolConfig);

  const checkpointSaver = new PostgresSaver(pool);


  const setup = async () => {
    await checkpointSaver?.setup();
  };
  const close = async () => {
    await pool.end();
  };

  return { checkpointSaver, close, setup };
};

const inmemoryCheckpointer = () => {
  const checkpointSaver = new MemorySaver();

  const setup = async () => {};
  const close = async () => {};


  return { checkpointSaver, setup, close };
};

const initCheckpoitntSaver = async () => {
  const {
    checkpointSaver,
    setup,
    close,
  } = process.env.MESSAGE_STORAGE === "IN_MEMORY"
    ? inmemoryCheckpointer()
    : await postgresCheckpointer();

  if (checkpointSaver instanceof PostgresSaver) await setup();

  return { checkpointSaver, close };
};

export const { checkpointSaver, close } = await initCheckpoitntSaver();
