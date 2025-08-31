"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { isBrowser } from "../components/ChatInterface";
import axios from "axios";

export interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      // Example API call
      const { data } = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(data);
      setUser(data.user);

      if (isBrowser()) {
      }
      if (isBrowser()) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (data.status) {
        router.push("/chat");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/v1/auth/logout", {
        withCredentials: true,
      });

      console.log(res.data.message);
      setUser(null);

      if (isBrowser()) {
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.log(err);
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
