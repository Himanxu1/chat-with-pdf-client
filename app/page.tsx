import FileUpload from "./components/fileUpload";
import Chatai from "./components/chatai";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto">
          <FileUpload />
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-5xl mx-auto h-full">
          <Chatai />
        </div>
      </div>
    </div>
  );
}
