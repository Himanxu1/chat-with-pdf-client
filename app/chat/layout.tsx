"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "../components/Sidebar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider style={{ marginTop: "20px" }}>
        <AppSidebar />
        <SidebarTrigger size={"lg"} />
        <section className="flex items-center justify-between  "></section>
        <div className=" w-full bg-background  p-4">{children}</div>
      </SidebarProvider>
    </div>
  );
};

export default ChatLayout;
