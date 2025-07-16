import React, { useEffect, useRef, useState } from "react";
import { sendMessage, fetchChatHistory } from "@/api/chatApi";

interface ChatWindowProps {
  user: { id: number; username: string };
  onClose: () => void;
  senderId: number;
}

interface Message {
  from: number;
  to: number;
  message: string;
  timestamp: string;
  mine?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, onClose, senderId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Polling for new messages every 3 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory(user.id);
        let msgs = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
          ? data.messages
          : [];
        msgs = msgs.map((msg: any) => ({
          from: Number(msg.sender_id ?? msg.from),
          to: Number(msg.receiver_id ?? msg.to),
          message: msg.message,
          timestamp: msg.time || msg.timestamp || new Date().toISOString(),
          mine: Number(msg.sender_id ?? msg.from) === Number(senderId),
        }));
        setMessages(msgs);
      } catch {}
    };
    loadHistory();
    interval = setInterval(loadHistory, 1000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [user.id, senderId]);

  // Always scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await sendMessage(user.id, input);
      setInput("");
      // Immediately reload chat after sending
      const data = await fetchChatHistory(user.id);
      let msgs = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
        ? data.messages
        : [];
      msgs = msgs.map((msg: any) => ({
        from: Number(msg.sender_id ?? msg.from),
        to: Number(msg.receiver_id ?? msg.to),
        message: msg.message,
        timestamp: msg.time || msg.timestamp || new Date().toISOString(),
        mine: Number(msg.sender_id ?? msg.from) === Number(senderId),
      }));
      setMessages(msgs);
    } catch (err) {
      alert("Failed to send message: " + err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md p-4 relative flex flex-col"
        style={{ width: 400 }}
      >
        <button
          className="absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-2 font-semibold text-lg border-b pb-2 flex items-center gap-2">
          <span className="rounded-full bg-primary text-primary-foreground px-2 py-1 text-sm">
            {user.username[0].toUpperCase()}
          </span>
          <span>Chat with {user.username}</span>
        </div>
        <div
          className="flex-1 overflow-y-auto border rounded p-2 mb-2 bg-muted"
          style={{ minHeight: 320, maxHeight: 320 }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm mt-24">
              No messages yet.
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.mine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs break-words shadow text-sm ${
                    msg.mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-foreground border"
                  }`}
                >
                  {msg.message}
                  <div className="text-[10px] text-right mt-1 opacity-60">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            disabled={sending}
            autoFocus
          />
          <button
            className="bg-primary text-primary-foreground px-4 py-1 rounded disabled:opacity-60"
            onClick={handleSend}
            disabled={sending || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
