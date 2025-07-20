import React, { useState, useEffect } from "react";
import { fetchAllUsers } from "@/api/userApi";
import ChatWindow from "./ChatWindow";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: number;
  username: string;
  [key: string]: any;
}

interface ChatListProps {
  selectedUser?: User | null;
  onUserSelect?: (user: User) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedUser, onUserSelect }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Persist recent chats in localStorage
  const [recentChats, setRecentChats] = useState<User[]>(() => {
    const saved = localStorage.getItem("recentChats");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = search.trim()
    ? users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Add user to recent chats if not already present
  const handleUserSelect = (user: User) => {
    if (onUserSelect) onUserSelect(user);
    setRecentChats((prev) => {
      if (prev.find((u) => u.id === user.id)) return prev;
      const updated = [user, ...prev];
      localStorage.setItem("recentChats", JSON.stringify(updated));
      return updated;
    });
  };

  // Keep recentChats in localStorage in sync if user reloads or closes search
  useEffect(() => {
    localStorage.setItem("recentChats", JSON.stringify(recentChats));
  }, [recentChats]);

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-2 py-1 border rounded"
      />

      {/* Recent Chats always below search input */}

      {recentChats.length > 0 && (
        <div className="mt-2">
          <div className="mb-1 text-xs text-muted-foreground font-semibold">
            Recent Chats
          </div>
          <div className="space-y-2">
            {recentChats.map((user) => (
              <div
                key={user.id}
                className={`p-2 border rounded cursor-pointer hover:bg-accent ${
                  selectedUser?.id === user.id ? "bg-accent" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="mt-2 text-sm">Loading users...</div>}
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      {search.trim() && !loading && !error && (
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-sm text-muted-foreground">No users found.</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-2 border rounded cursor-pointer hover:bg-accent ${
                  selectedUser?.id === user.id ? "bg-accent" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                {user.username}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
