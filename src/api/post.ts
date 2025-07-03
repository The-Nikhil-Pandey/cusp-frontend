import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PostUpload {
  id: number;
  image: string | null;
  video: string | null;
}

export interface PostTag {
  tag_id: number;
  tag_title: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  likes: string;
  comments: string;
  tags: PostTag[];
  created_at: string;
  updated_at: string | null;
  status: number;
  user_id: string;
  username: string;
  email: string;
  phone: string;
  company_name: string;
  job_title: string;
  uploads: PostUpload[];
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await axios.get(`${API_BASE_URL}/post/`);
  return res.data;
}

export const createPost = async (formData: FormData) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.post(`${API_BASE_URL}/post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};

export const likePost = async (post_id: string, like: "yes" | "no") => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.patch(
    `${API_BASE_URL}/like-status`,
    { post_id, like },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};
