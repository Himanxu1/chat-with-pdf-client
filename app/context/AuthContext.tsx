"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { isBrowser } from "../components/ChatInterface";
import { apiMethods } from "@/lib/api";
import { handleApiError } from "@/lib/errorHandler";

export interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => voi
  d;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  // simulate token persistence
  useEffect(() => {
    let storedUser;
    if (isBrowser()) {
      storedUser = localStorage.getItem("user");
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiMethods.post("/api/v1/auth/login", {
        email,
        password,
      });

      console.log(data);
      setUser(data.user);

      if (isBrowser()) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data.status) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error handling is done by the API interceptor
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiMethods.get("/api/v1/auth/logout");

      setUser(null);

      if (isBrowser()) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.log(err);
      // Even if logout fails on server, clear local state
      setUser(null);
      if (isBrowser()) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
