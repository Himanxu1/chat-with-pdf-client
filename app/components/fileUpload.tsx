"use client";
import { Upload, FileText } from "lucide-react";
import React, { useState } from "react";

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      console.log(file, "file");
      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("pdf", file);

        try {
          const response = await fetch("http://localhost:3001/pdf/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log("File uploaded successfully:", data);
          setUploadedFile(file.name);
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setIsUploading(false);
        }
      }
    });
    el.click();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">PDF Chat Assistant</h2>
        {uploadedFile && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FileText className="w-4 h-4" />
            <span>{uploadedFile}</span>
          </div>
        )}
      </div>
      
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload PDF
          </>
        )}
      </button>
    </div>
  );
};

export default FileUpload;
