import Section from "./Section";
import { ChatInterface } from "../chat/ChatInterface";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";

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
