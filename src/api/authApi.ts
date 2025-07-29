import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function googleSignUp() {
  const res = await axios.get(`${API_BASE_URL}/auth/google`);
  return res.data;
}
