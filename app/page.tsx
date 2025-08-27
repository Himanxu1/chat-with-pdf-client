import FileUpload from "./components/fileUpload";
import ChatInterface from "./components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <FileUpload />
          </div>
          
          <div className="h-[calc(100vh-200px)]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
