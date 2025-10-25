import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area.js";
import { createMessage } from "../../lib/chatService.js";
import type { Message } from "../../lib/chatService.js";
import { ChatMessage } from "./ChatMessage.js";
import { ChatInput } from "./ChatInput.js";
import { apiRequest } from "@/services/apiClient.js";
import { useNavigate } from "react-router";
import { API_URL } from "@/constants";


export function ChatInterface() {

  const navigate = useNavigate()

  const [messages, setMessages] = useState<Message[]>([
    createMessage(
      "assistant",
      "Hello! I'm your AI assistant. How can I help you today?"
    ),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    const userMessage = createMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const res = await apiRequest<{content:string, conversationId: string}>(
        `${API_URL}/chat?prompt=${encodeURIComponent(content)}`
      );

      const aiMessage = createMessage("assistant", res.content);
      setMessages((prev) => [...prev, aiMessage]);

      navigate(`/chat/${res.conversationId}`)
    } catch (error) {
      console.log(error);

      const aiMessage = createMessage(
        "assistant",
        "Sorry, I encountered an error. Please try again."
      );
      setMessages((prev) => [...prev, aiMessage]);
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
