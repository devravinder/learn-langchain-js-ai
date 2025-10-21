import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import CheckpointService from "./CheckpointService";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";

class ChatGraph {
  readonly checkpointSaverService;
  readonly state;
  readonly builder;
  readonly model;
  private graph: ReturnType<typeof this.initializeGraph>;
  constructor(
    checkpointSaverService: CheckpointService,
    model: ChatOllama | ChatGroq
  ) {
    this.checkpointSaverService = checkpointSaverService;

    this.state = this.initializeState();

    this.builder = this.initializeBuilder();

    this.model = model;

    // this.graph = this.initializeGraph();
  }

  async init() {
    this.checkpointSaverService.init();
    this.graph = this.initializeGraph();
  }

  private initializeState() {
    const StateAnnotation = Annotation.Root({
      messages: Annotation<BaseMessage[]>({
        reducer: (state: BaseMessage[], update: BaseMessage[]) =>
          state.concat(update),
        default: () => [],
      }),
    });

    return StateAnnotation;
  }
  private initializeBuilder() {
    const builder = new StateGraph(this.state)
      .addNode("agent", this.agentNode)
      .addEdge(START, "agent")
      .addEdge("agent", END);

    return builder;
  }

  private initializeGraph() {
    const graph = this.builder.compile({
      checkpointer: this.checkpointSaverService.getCheckpointer(),
    });

    return graph;
  }

  // use arrow function or use .bind() in constructor
  private agentNode = async (
    state: typeof this.state.State,
    config?: RunnableConfig
  ) => {
    const systemPrompt =
      new SystemMessage(`You are a helpful assistant. Answer all questions in short, simple, and give precise answer.
          chcek the previous conversation for context`);
    const response = await this.model.invoke([systemPrompt, ...state.messages]);
    return { messages: [response] };
  };

  async query(input: string, conversationId: string) {
    const userInput = { messages: [new HumanMessage(input)] };
    const {messages} = await this.graph.invoke(userInput, {
      configurable: { thread_id: conversationId },
      recursionLimit: 5,
    });

    const last = messages[messages.length-1]

    return last.content;
  }

  async getHistory(conversationId: string) {
    const messages = await this.graph.getStateHistory({
      configurable: { thread_id: conversationId },
    });

    return messages;
  }
}

export default ChatGraph;
