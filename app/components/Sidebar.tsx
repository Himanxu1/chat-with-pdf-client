/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronUp, CreditCard, LogOut, Plus, User2 } from "lucide-react";
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

  const handlePayment = async () => {
    // 1. Create order on backend
    const res = await fetch(
      "http://localhost:3001/api/v1/payment/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }),
      }
    );
    const order = await res.json();

    // 2. Razorpay options
    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "My SaaS App",
      description: "SaaS Subscription",
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify payment
        const verifyRes = await fetch(
          "http://localhost:3001/api/v1/payment/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );
        const verify = await verifyRes.json();
        alert(verify.message);
      },
      prefill: {
        email: user.email,
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("token") || "";
      const user = JSON.parse(localStorage.getItem("user") || "");

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
          <SidebarGroupLabel
            onClick={() => router.push("/chat")}
            style={{ cursor: "pointer" }}
          >
            Chat PDF
          </SidebarGroupLabel>
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
                  <ChevronUp className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[240px] rounded-xl shadow-md border bg-white dark:bg-gray-900 animate-in fade-in-80 slide-in-from-bottom-2 duration-200"
              >
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handlePayment}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-md flex items-center"
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Pay
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
