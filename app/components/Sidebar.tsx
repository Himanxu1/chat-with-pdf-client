/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronUp, Plus, User2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [userChats, setUserChats] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  console.log(userProfile, "user");
  const router = useRouter();
  const params = useParams();
  const activeChatId = params.slug as string;

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  const handleAddChat = async () => {
    if (!userProfile?.id || !token) return;

    const response = await axios.post(
      "http://localhost:3001/api/v1/chat/new",
      {
        userId: user.id,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

    const newChat = response.data;
    setUserChats((prevChats: any) => [newChat, ...prevChats]);
    router.push(`/chat/${newChat.id}`);
  };

  const fetchChats = useCallback(async () => {
    if (!userProfile?.id || !token) return;
    const result = await axios.get(
      `http://localhost:3001/api/v1/chat/user/${user?.id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    setUserChats(result.data);
  }, [userProfile, token, user?.id]);

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("token") || "";
      const user = JSON.parse(localStorage.getItem("user") || "");
      console.log(user);
      setToken(token);
      setUserProfile(user);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [userProfile, token, fetchChats]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat PDF</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button className="mt-10 p-4" onClick={handleAddChat}>
              <Plus /> Add Chat
            </Button>
            <SidebarMenu className="mt-6 cursor-pointer">
              {userChats.map((item: any, index: number) => (
                <SidebarMenuItem
                  key={item.id}
                  className={
                    item.id === activeChatId
                      ? "bg-gray-200 dark:bg-gray-700"
                      : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <h1 onClick={() => handleChatClick(item.id)}>{`Chat ${
                      index + 1
                    }`}</h1>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="bg-black w-full">
                  <Button onClick={handleSignOut}>Sign out</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
