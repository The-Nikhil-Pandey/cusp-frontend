import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCourses(token: string) {
  const res = await axios.get(`${API_BASE_URL}/course`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchLessons(token: string) {
  const res = await axios.get(`${API_BASE_URL}/lession`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchTopics(token: string) {
  const res = await axios.get(`${API_BASE_URL}/topic/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
