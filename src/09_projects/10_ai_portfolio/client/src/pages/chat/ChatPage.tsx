import { ChatInterface } from "@/pages/chat/ChatInterface";
import type { Message } from "@/services/apiClient";
import { useLoaderData, useParams } from "react-router";

export default function ChatPage() {
  const { conversationId } = useParams(); // use as key to trigger update the UI
  const messages = useLoaderData<Message[]>();

  return <ChatInterface key={conversationId} history={messages} />;
}
