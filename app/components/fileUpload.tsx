"use client";
import { Upload, FileText, Bot } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { isBrowser } from "./ChatInterface";

const FileUpload = ({ chatId }: { chatId: string }) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("chatId", chatId);
        let token;
        if (isBrowser()) {
          token = localStorage.getItem("token") ?? "";
        }

        try {
          const response = await fetch(
            "http://localhost:3001/api/v1/chat/pdf",
            {
              method: "POST",
              body: formData,
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("File uploaded successfully:", data);
          setUploadedFile(file.name);
          toast.success(`PDF "${file.name}" uploaded successfully!`);
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload PDF. Please try again.");
        } finally {
          setIsUploading(false);
        }
      }
    });
    el.click();
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDF Chat Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your PDF and start chatting with AI
              </p>
            </div>
          </div>

          {uploadedFile && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              <FileText className="w-3 h-3 mr-1" />
              {uploadedFile}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing PDF...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
