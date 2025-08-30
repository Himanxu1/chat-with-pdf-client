/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronUp, Plus, User2, Users } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [userChats, setUserChats] = useState([]);
  const [token, setToken] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  console.log(userProfile, "user");
  const router = useRouter();
  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  /***
   *   api call to get the existing chat with the pdf id and user id and chat id so
   *   that the context should be the same
   */
  const handleAddChat = async () => {
    if (!userProfile?.id || !token) return;
    // make an api request to create a chat and this will return the chatId we need to store it somewhere to user it for params
    // to get the chat .

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
  };

  const fetchChats = async () => {
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
  };

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    console.log("first");
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("token") || "";
      const user = JSON.parse(localStorage.getItem("user") || "");
      console.log(user);
      setToken(token);
      setUserProfile(user);
    }
  }, []);

  useEffect(() => {
    console.log("secon");
    fetchChats();
  }, [userProfile, token]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chat PDF</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button className="mt-10 p-4" onClick={handleAddChat}>
              <Plus /> Add Chat
            </Button>
            <SidebarMenu className="mt-6">
              {userChats.map((item: any) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <h1 onClick={() => handleChatClick(item.id)}>{item.id}</h1>
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
