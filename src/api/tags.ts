import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Tag {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string | null;
  status: number;
}

export const fetchTags = async (): Promise<Tag[]> => {
  const res = await axios.get(`${API_BASE_URL}/tags/`);
  return res.data;
};
