// src/api/index.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const registerUser = async (data: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  return response.data;
};
