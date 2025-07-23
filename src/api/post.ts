// Delete a post by ID
export const deletePost = async (post_id: string, token: string) => {
  const res = await axios.delete(`${API_BASE_URL}/post/${post_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// Update a post by ID (PATCH)
export const updatePost = async (post_id: string, data: any, token: string) => {
  const res = await axios.patch(`${API_BASE_URL}/post/${post_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Fetch a post by ID
export const fetchPostById = async (post_id: string, token: string) => {
  const res = await axios.get(`${API_BASE_URL}/post/${post_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
// Save a post
export const savePost = async (post_id: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.post(
    `https://api.dreamsquats.co.uk/api/save-post/`,
    { post_id },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};

// Unsave a post
export const unsavePost = async (post_id: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.delete(
    `https://api.dreamsquats.co.uk/api/delete-post`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: { post_id },
    }
  );
  return res.data;
};
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
  profile_photo: any;
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
  return res.data.reverse() as Post[];
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
