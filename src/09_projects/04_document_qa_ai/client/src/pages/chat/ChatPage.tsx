import { ChatInterface } from "@/components/chat/ChatInterface";
import { useLoaderData } from "react-router";



export default function ChatPage() {
  const loaderData = useLoaderData()
  console.log({loaderData})
  return (
   
    <ChatInterface/>
  )
}
