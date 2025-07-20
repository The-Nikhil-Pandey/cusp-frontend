import React, { useState, useEffect } from "react";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

// Responsive hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

const Chats: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recentChats, setRecentChats] = useState(() => {
    const saved = localStorage.getItem("recentChats");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync recentChats from ChatList
  useEffect(() => {
    const saved = localStorage.getItem("recentChats");
    setRecentChats(saved ? JSON.parse(saved) : []);
  }, [sidebarOpen, selectedUser]);

  // Handler for selecting user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSidebarOpen(false);
  };

  // Sidebar content
  const Sidebar = (
    <div
      className={
        `h-full bg-background border-r w-72 p-4 flex flex-col` +
        (theme === "dark" ? "" : "")
      }
    >
      <div className="mb-4 text-lg font-bold">Chats</div>
      <ChatList selectedUser={selectedUser} onUserSelect={handleUserSelect} />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="hidden md:flex flex-col w-72 border-r h-screen sticky top-0 bg-background">
          {Sidebar}
        </div>
      )}
      {/* Mobile sidebar as drawer */}
      {isMobile && (
        <>
          <button
            className="fixed top-2 left-36 z-50 bg-primary text-primary-foreground px-3 py-2 rounded shadow"
            onClick={() => setSidebarOpen(true)}
          >
            Chats
          </button>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={`fixed top-0 left-0 h-full w-72 bg-background border-r z-50 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {Sidebar}
          </div>
        </>
      )}
      {/* Chat area */}
      <div className="flex-1 flex items-center sm:mt-14 mt-28 justify-center">
        <div className="w-full mx-auto">
          {selectedUser ? (
            <ChatArea
              selectedUser={selectedUser}
              senderId={Number(user?.id)}
              onClose={() => setSelectedUser(null)}
              theme={theme}
            />
          ) : (
            <ChatArea
              selectedUser={null}
              senderId={Number(user?.id)}
              theme={theme}
              onClose={null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Inline chat area component
import { sendMessage, fetchChatHistory } from "@/api/chatApi";

const ChatArea = ({ selectedUser, senderId, onClose, theme }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = React.useRef(null);
  const chatBoxRef = React.useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;
    const loadHistory = async () => {
      try {
        const data = await fetchChatHistory(selectedUser.id);
        const msgs = Array.isArray(data?.messages || data)
          ? (data.messages || data).map((msg) => ({
              from: Number(msg.sender_id ?? msg.from),
              to: Number(msg.receiver_id ?? msg.to),
              message: msg.message,
              timestamp: msg.time || msg.timestamp || new Date().toISOString(),
              mine: Number(msg.sender_id ?? msg.from) === Number(senderId),
            }))
          : [];
        setMessages(msgs);
      } catch {}
    };
    loadHistory();
    const interval = setInterval(loadHistory, 1000);
    return () => clearInterval(interval);
  }, [selectedUser, senderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = chatBoxRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setShowScrollBtn(!atBottom);
  };

  useEffect(() => {
    const el = chatBoxRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await sendMessage(selectedUser.id, input);
      setInput("");
      const data = await fetchChatHistory(selectedUser.id);
      const msgs = Array.isArray(data?.messages || data)
        ? (data.messages || data).map((msg) => ({
            from: Number(msg.sender_id ?? msg.from),
            to: Number(msg.receiver_id ?? msg.to),
            message: msg.message,
            timestamp: msg.time || msg.timestamp || new Date().toISOString(),
            mine: Number(msg.sender_id ?? msg.from) === Number(senderId),
          }))
        : [];
      setMessages(msgs);
    } catch (err) {
      alert("Failed to send message: " + err);
    } finally {
      setSending(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24">
        <div className="text-muted-foreground text-lg mb-4">
          Select a user to start chatting.
        </div>
        <div className="w-full max-w-md bg-background border rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl">💬</span>
          <div className="mt-2 text-muted-foreground">No chat selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background shadow-lg w-full h-[92vh] flex flex-col border">
      {/* Header */}
      <div className="font-semibold text-lg border-b px-4 py-2 flex items-center gap-2">
        <span className="rounded-full bg-primary text-primary-foreground px-2 py-1 text-sm">
          {selectedUser.username[0].toUpperCase()}
        </span>
        <span>{selectedUser.username}</span>
        {/* {onClose && (
          <button
            className="ml-auto text-muted-foreground hover:text-destructive px-2 py-1 rounded"
            onClick={onClose}
          >
            Close
          </button>
        )} */}
      </div>

      {/* Chat messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 relative"
      >
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm mt-24">
            No messages yet.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs shadow text-sm break-words ${
                  msg.mine
                    ? "bg-primary text-primary-foreground"
                    : theme === "dark"
                    ? "bg-background text-foreground border"
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
        {showScrollBtn && (
          <button
            className="absolute right-4 bottom-4 bg-primary text-primary-foreground px-3 py-1 rounded-full shadow-lg hover:bg-primary/80 transition"
            onClick={scrollToBottom}
          >
            ↓ Latest
          </button>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t p-3 flex gap-2">
        <input
          type="text"
          autoFocus
          className="flex-1 border rounded px-3 py-2 bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
        />
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSend}
          disabled={sending || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;
