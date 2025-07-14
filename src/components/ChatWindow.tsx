import React, { useEffect, useRef, useState } from "react";
import { sendMessage, fetchChatHistory } from "@/api/chatApi";

interface ChatWindowProps {
  user: { id: number; username: string };
  onClose: () => void;
}

interface Message {
  from: number;
  to: number;
  message: string;
  timestamp: string;
  mine?: boolean;
}

const WS_URL = "ws://31.97.56.234:8000/ws/chat";

const ChatWindow: React.FC<ChatWindowProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get sender id from token (assume userId is stored in localStorage)
  const senderId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    let isMounted = true;
    // Fetch chat history first
    fetchChatHistory(user.id)
      .then((data) => {
        // Support both { messages: [...] } and [...]
        let msgs = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
          ? data.messages
          : [];
        // Normalize to Message[]
        msgs = msgs.map((msg: any) => ({
          from: Number(msg.sender_id ?? msg.from),
          to: Number(msg.receiver_id ?? msg.to),
          message: msg.message,
          timestamp: msg.time || msg.timestamp || new Date().toISOString(),
          // Mark as sent by me if sender_id matches my id
          mine: Number(msg.sender_id ?? msg.from) === Number(senderId),
        }));
        if (isMounted) {
          setMessages(msgs);
        }
      })
      .catch(() => {});

    // Open websocket connection
    const socket = new window.WebSocket(`${WS_URL}/${senderId}/${user.id}`);
    setWs(socket);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.message) {
          setMessages((prev) => [
            ...prev,
            {
              from: Number(data.sender_id ?? data.from),
              to: Number(data.receiver_id ?? data.to),
              message: data.message,
              timestamp:
                data.time || data.timestamp || new Date().toISOString(),
              mine: Number(data.sender_id ?? data.from) === Number(senderId),
            },
          ]);
        }
      } catch {}
    };

    return () => {
      isMounted = false;
      socket.close();
    };
    // eslint-disable-next-line
  }, [user.id]);

  // Always scroll to bottom on open and when messages change
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      // Send via websocket for real-time
      ws?.send(
        JSON.stringify({
          from: senderId,
          to: user.id,
          message: input,
        })
      );
      // Send via API for persistence
      await sendMessage(user.id, input);
      // Immediately update UI for sender (so sender sees their own message instantly)
      setMessages((prev) => [
        ...prev,
        {
          from: senderId,
          to: user.id,
          message: input,
          timestamp: new Date().toISOString(),
          mine: true,
        },
      ]);
      setInput("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      // Optionally show error
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
