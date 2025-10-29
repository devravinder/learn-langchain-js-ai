import { ChatInterface } from "@/pages/chat/ChatInterface";
import type { Message } from "@/services/apiClient";
import { useLoaderData } from "react-router";



export default function ChatPage() {
  const messages = useLoaderData<Message[]>()
  return (
    <ChatInterface history={messages}/>
  )
}
