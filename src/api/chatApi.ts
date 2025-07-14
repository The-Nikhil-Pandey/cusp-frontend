import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://31.97.56.234:8000/api";

export const sendMessage = async (to: number, message: string) => {
  const token =
    localStorage.getItem("cusp-token") || localStorage.getItem("token");
  const res = await axios.post(
    `${API_BASE_URL}/chat/send`,
    { to, message },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};

export const fetchChatHistory = async (receiverId: number) => {
  const token =
    localStorage.getItem("cusp-token") || localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/chat/${receiverId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};
