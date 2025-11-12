import { Outlet } from "react-router";
import LeftMenu from "./LeftMenu.js";
import RightMenu from "./RightMenu.js";
import Section from "./Section.js";

export default function MainLayout() {
  return (
    <main className="h-[100dvh] flex flex-row relative">
      <LeftMenu />
      <Section>
        <Outlet />
      </Section>
      <RightMenu />
    </main>
  );
}
