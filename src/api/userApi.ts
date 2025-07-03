import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserById = async (id: string) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.get(`http://31.97.56.234:8000/api/users/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};
