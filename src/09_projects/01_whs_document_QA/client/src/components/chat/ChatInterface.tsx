import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { createMessage } from "../../lib/chatService";
import type { Message } from "../../lib/chatService";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const apiUrl = window.__RUNTIME_CONFIG__.BUN_PUBLIC_API_URL;

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    createMessage(
      "assistant",
      "Hello! I'm your AI assistant. How can I help you today?"
    ),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const callAI = (content: string) => {
    const eventSource = new EventSource(
      `${apiUrl}/chat?prompt=${encodeURIComponent(content)}`
    );
    eventSourceRef.current = eventSource;

    // set first empty
    const assistantMessage = createMessage("assistant", "Thinking...");
    setMessages((prev) => [...prev, assistantMessage]);

    let data = "";
    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        return;
      }
      data += event.data;

      setMessages((prev) => {
        const newMessages = [...prev];
        let last = newMessages.at(-1)!;
        last.content = data;

        return newMessages;
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  };

  const handleSendMessage = async (content: string) => {
    const userMessage = createMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      await callAI(content);
    } catch (error) {
      const errorMessage = createMessage(
        "assistant",
        "Sorry, I encountered an error. Please try again."
      );
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full justify-between relative ">
      <ScrollArea className="flex-1 pb-16 overflow-y-auto">
        <div className="space-y-4 px-12 pt-4 pb-20 w-full max-w-5xl min-w-sm mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
            />
          ))}
          {isTyping && <ChatMessage role="assistant" content="Typing..." />}
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
