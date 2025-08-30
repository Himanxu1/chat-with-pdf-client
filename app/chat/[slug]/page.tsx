/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ChatInterface from "@/app/components/ChatInterface";
import FileUpload from "@/app/components/fileUpload";
import React from "react";
import { use } from "react";

const Chat = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto p-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <FileUpload chatId={slug} />
            </div>

            <div className="h-[calc(100vh-200px)]">
              <ChatInterface chatId={slug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
