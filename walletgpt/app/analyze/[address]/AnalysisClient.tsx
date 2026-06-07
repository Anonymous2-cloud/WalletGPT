"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AnalysisClient({
  address,
}: {
  address: string;
}) {
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load initial wallet analysis
  useEffect(() => {
    async function analyzeWallet() {
      try {
        setIsThinking(true);

        const response = await fetch(
          "/api/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              address,
            }),
          }
        );

        const data = await response.json();

        setSummary(data.summary);

        setMessages([
          {
            role: "assistant",
            content: data.summary,
          },
        ]);
      } catch (error) {
        console.error(error);

        setMessages([
          {
            role: "assistant",
            content:
              "Failed to analyze wallet.",
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    }

    analyzeWallet();
  }, [address]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  async function askQuestion() {
    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      setIsThinking(true);

      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            walletSummary: summary,
            question: userQuestion,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto h-screen flex flex-col">
      <h1 className="text-4xl font-bold p-4">
        WalletGPT
      </h1>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-4 rounded-2xl whitespace-pre-wrap ${
                message.role ===
                "assistant"
                  ? "bg-gray-100 text-black"
                  : "bg-black text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black rounded-2xl px-4 py-3 animate-pulse">
              WalletGPT is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t p-4 bg-white">
        <input
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask about this wallet..."
          className="flex-1 border rounded-lg p-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askQuestion();
            }
          }}
        />

        <button
          onClick={askQuestion}
          className="bg-black text-white px-6 rounded-lg"
        >
          Send
        </button>
      </div>
    </main>
  );
}