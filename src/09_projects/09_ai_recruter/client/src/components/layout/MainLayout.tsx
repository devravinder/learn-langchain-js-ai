import Section from "./Section.js";
import LeftMenu from "./LeftMenu.js";
import RightMenu from "./RightMenu.js";
import { Outlet } from "react-router";

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
