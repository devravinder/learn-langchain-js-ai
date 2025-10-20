import Section from "./Section.js";
import { ChatInterface } from "../chat/ChatInterface.js";
import LeftMenu from "./LeftMenu.js";
import RightMenu from "./RightMenu.js";

export default function MainLayout() {
  return (
    <main className="h-[100dvh] flex flex-row relative">
      <LeftMenu/>
      <Section >
        <ChatInterface/>
      </Section>
      <RightMenu/>
    </main>
  );
}
