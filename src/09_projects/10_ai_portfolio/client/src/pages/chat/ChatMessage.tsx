import MarkdownRenderer from "../../components/MarkdownRenderer.js";
import { type Message } from "../../services/apiClient.js";


export function ChatMessage({ role, content }: Message) {
  const isHuman = role === "human";

  return isHuman ? (
    <UserMessage content={content} />
  ) : (
    <AIMessage content={content} />
  );
}

const AIMessage = ({ content }: { content: string }) => {
  return (
    <div className={"flex items-start"}>
      <div className={"max-w-[75%] rounded-lg p-4 bg-muted/50"}>
        <MarkdownRenderer text={content} />
      </div>
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className={"flex items-start flex-row-reverse"}>
      <div
        className={
          "max-w-[75%] rounded-lg p-4 bg-primary text-primary-foreground"
        }
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
};
