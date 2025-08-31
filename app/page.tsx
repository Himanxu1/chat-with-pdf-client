"use client";

import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/Sidebar";
import { Nav } from "./components/Landing/nav";
import { Hero } from "./components/Landing/hero";
import { Features } from "./components/Landing/features";
import { Steps } from "./components/Landing/steps";
import { Pricing } from "./components/Landing/pricing";
import { FAQ } from "./components/Landing/faq";
import { Footer } from "./components/Landing/footer";

export default function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <Features />
      <Steps />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
