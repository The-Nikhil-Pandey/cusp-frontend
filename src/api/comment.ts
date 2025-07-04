import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const fetchCommentsByPostId = async (postId: string) => {
  const res = await axios.get(`${API_BASE_URL}/comment/post-id/${postId}`);
  return res.data;
};

export const addComment = async (postId: string, commentText: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.post(
    `${API_BASE_URL}/comment`,
    { post_id: postId, comment_text: commentText },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};

export const addReply = async (
  postId: string,
  commentId: string,
  replyText: string
) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.post(
    `${API_BASE_URL}/reply`,
    { post_id: postId, comment_id: commentId, reply_text: replyText },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.delete(`${API_BASE_URL}/comment/${commentId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};

export const deleteReply = async (replyId: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.delete(`${API_BASE_URL}/reply/${replyId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};
