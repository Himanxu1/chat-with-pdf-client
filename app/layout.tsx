import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { MotionWrapper } from "./components/MotionWrapper";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Chat Assistant",
  description: "Chat with your PDF documents using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Analytics />
      <SpeedInsights />
      <AuthProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <head>
              <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            </head>
            <section className="flex items-center justify-between"></section>
            <MotionWrapper>{children}</MotionWrapper>
            <Toaster />
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  );
}
