import ChatGraph from "./ChatGraph";
import CheckpointService from "./CheckpointService";
import { chatModel } from "./models";

const checkpointService = new CheckpointService();


const chatGraph = new ChatGraph(checkpointService, chatModel);

const initializeService = async () => {
  await chatGraph.init()
};

const query = async  (prompt: string, conversationId: string)=>{
  return chatGraph.query(prompt, conversationId)
}

const getHistory = async(conversationId: string)=>{
  return chatGraph.getHistory(conversationId)
}

export default {
  initializeService,
  query,
  getHistory,
};
