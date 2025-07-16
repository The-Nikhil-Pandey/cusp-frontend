import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reportPost = async (post_id: string, reason: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.post(
    `${API_BASE_URL}/report-post`,
    { post_id, reason },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};
