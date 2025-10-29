import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "../../components/ui/scroll-area.js";
import { ChatMessage } from "./ChatMessage.js";
import { ChatInput } from "./ChatInput.js";
import { apiClient, type Message } from "@/services/apiClient.js";
import { useNavigate, useParams } from "react-router";

export function ChatInterface({ history }: { history: Message[] }) {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>(history);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (message: string) => {
    const userMessage = createMessage("human", message);
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const { data: content, error } = await apiClient.POST(
      conversationId ? "/api/chat/{conversationId}" : "/api/chat",
      {
        params: {
          path: { conversationId: conversationId! },
        },
        body: {
          message,
        },
      }
    );

    setIsTyping(false);

    if (error) {
      const aiMessage = createMessage(
        "ai",
        "Sorry, I encountered an error. Please try again."
      );
      setMessages((prev) => [...prev, aiMessage]);

      return;
    }

    const aiMessage = createMessage("ai", content.response);
    setMessages((prev) => [...prev, aiMessage]);

    if (!conversationId) navigate(`/chat/${content.conversationId}`);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full justify-between relative ">
      <ScrollArea className="flex-1 pb-16 overflow-y-auto">
        <div className="space-y-4 px-12 pt-4 pb-20 w-full min-w-sm mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          {isTyping && (
            <ChatMessage
              role="ai"
              id="thinking-placeholder"
              content="Thinking..."
            />
          )}
        </div>
        <div ref={scrollRef} /> {/* 👈 Invisible marker */}
      </ScrollArea>
      <div className="absolute bottom-10 w-full bg-background">
        <div className="py-4 px-12 w-full max-w-5xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}

const createMessage = (role: "ai" | "human", content: string): Message => ({
  id: crypto.randomUUID(),
  role,
  content,
});
