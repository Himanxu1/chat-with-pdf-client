"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const Chatai = () => {
  const [input, setInput] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const handleSubmit = useCallback(async () => {
    if (!canSend) return;
    setIsSending(true);
    setAnswer("");
    setQuestion(input.trim());

    try {
      const response = await axios.post("http://localhost:3001/chat", {
        question: input.trim(),
      });
      setAnswer(response.data.answer ?? "");
    } catch (error) {
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
      setInput("");
      // Scroll to bottom after update
      requestAnimationFrame(() => {
        scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [canSend, input]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-full h-full">
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6"
        >
          {!question && !answer && !isSending ? (
            <div className="text-center text-gray-500 mt-10">
              Ask a question about your uploaded PDF to get started.
            </div>
          ) : null}

          {question ? (
            <div className="flex justify-end">
              <div className="message-bubble bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-prose shadow-sm">
                {question}
              </div>
            </div>
          ) : null}

          {isSending ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold select-none">
                AI
              </div>
              <div className="message-bubble bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm text-black">
                <div className="flex items-center gap-2">
                  <span>...generating</span>
                  <span className="typing-dots" aria-live="polite" aria-label="AI is typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {answer ? (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold select-none">
                AI
              </div>
              <div className="message-bubble bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 max-w-prose whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Ask anything about your PDF..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none placeholder:text-gray-400 focus:border-blue-500 text-black"
            />
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatai;
