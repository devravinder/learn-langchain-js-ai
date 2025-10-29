import {
  ChevronDown,
  History,
  Search,
  Settings,
  SquarePen
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

import { NavLink, useLoaderData } from "react-router";



export function AppSidebar() {

  const conversations =  useLoaderData<string[]>()

  return (
    <Sidebar>
      <SidebarHeader>AI Recruter</SidebarHeader>

      <div className="h-[1px] bg-border w-full my-1"></div>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to={`/chat`}>
                <SquarePen />
                <span>{"New Chat"}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <Settings />
                <span>{"Settins"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div>
                <Search />
                <span>{"Search"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuButton asChild>
                <CollapsibleTrigger>
                  <History />
                  <span>{"History"}</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <SidebarGroup>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {conversations.map((item) => (
                        <SidebarMenuItem key={item}>
                          <SidebarMenuButton asChild>
                            <NavLink to={`/chat/${item}`}>
                              <span>{item}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
        {/*  */}

        {/*  */}
      </SidebarContent>
    </Sidebar>
  );
}
