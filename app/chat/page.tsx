"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, MessageSquare, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Features } from "../components/Landing/features";

const ChatHome = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="space-y-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Chat with your PDFs
            </h1>
            <p className="text-pretty text-muted-foreground max-w-2xl mx-auto">
              Ask questions, get summaries, and extract insights from any PDF in
              seconds. Secure, fast, and easy to use.
            </p>
          </div>

          <div className="grid w-full gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Feature
                icon={<FileText className="h-4 w-4" aria-hidden="true" />}
                title="Understand"
              >
                Summaries, sections, and key points.
              </Feature>
              <Feature
                icon={<MessageSquare className="h-4 w-4" aria-hidden="true" />}
                title="Ask Anything"
              >
                Natural language Q&amp;A on your PDF.
              </Feature>
              <Feature
                icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                title="Private"
              >
                Your files stay secure.
              </Feature>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            No signup required for demos. Supports PDFs up to 25MB.
          </p>
        </div>
      </div>
    </section>
  );
};

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-left">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export default ChatHome;
