import React, { useEffect, useState, useRef } from "react";
import { api } from "../lib/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // 1. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 2. Fetch History AND Setup Real-time Listening
  useEffect(() => {
    // Fetch old messages (Fixes the 405 error if the route exists)
    const fetchMessages = async () => {
      try {
        const { data } = await api.get("/api/messages");
        setMessages(data);
      } catch (error) {
        console.error("Could not load history:", error);
      }
    };

    fetchMessages();

    // Listen for new messages (Fixes the real-time connection)
    if (window.Echo) {
      const channel = window.Echo.channel("chat").listen(
        ".MessageSent",
        (e) => {
          setMessages((prev) => {
            // Check if message already exists (prevents duplicates from sender)
            if (prev.some((m) => m.id === e.message.id)) return prev;
            return [...prev, e.message];
          });
        }
      );

      return () => window.Echo.leaveChannel("chat");
    }
  }, []);

  const send = async (e) => {
  e.preventDefault();
  const messageContent = input.trim();
  if (!messageContent) return;

  // 1. Create a "Fake" message for the UI
  const tempId = Date.now();
  const optimisticMessage = {
    id: tempId,
    body: messageContent,
    user: { name: "You" }, // Or your actual user object
    isSending: true,       // Useful if you want to show a '...' icon
  };

  // 2. Clear input and update UI IMMEDIATELY
  setInput("");
  setMessages((prev) => [...prev, optimisticMessage]);

  try {
    // 3. Send to server in the background
    const { data } = await api.post("/api/messages", {
      body: messageContent,
    });

    // 4. Replace the fake message with the real one from the server
    setMessages((prev) => 
      prev.map((m) => (m.id === tempId ? data : m))
    );
  } catch (error) {
    console.error("Chat error:", error);
    // 5. If it fails, remove the fake message
    setMessages((prev) => prev.filter((m) => m.id !== tempId));
    alert("Message failed to send.");
  }
};

  return (
    <div className="flex flex-col h-[400px] bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-zinc-500 text-xs">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id || Math.random()}
              className="flex flex-col items-start"
            >
              <span className="text-[10px] text-emerald-400 font-bold mb-1 ml-1">
                {/* Check both object and string formats for user */}
                {m.user?.name || (typeof m.user === 'string' ? m.user : "User")}
              </span>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-zinc-200">
                {m.body}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={send} className="p-3 bg-white/5 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 p-2.5 rounded-xl transition-transform active:scale-90"
          >
            <svg
              className="w-4 h-4 text-zinc-950"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925L10 10l-6.307 1.836-1.414 4.925a.75.75 0 0 0 .826.95 44.82 44.82 0 0 0 12.86-5.325.75.75 0 0 0 0-1.214 44.82 44.82 0 0 0-12.86-5.325Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}