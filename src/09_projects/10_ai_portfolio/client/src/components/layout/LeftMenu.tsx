import { Fragment } from "react/jsx-runtime";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger, SidebarProvider } from "../ui/sidebar";

export default function LeftMenu() {
  return (
      <div className="max-w-[18rem] sm:max-w-[16rem]">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger className="z-50" />
        </SidebarProvider>
      </div>
  );
}
