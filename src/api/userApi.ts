import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserById = async (id: string | number) => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};

export const fetchAllUsers = async () => {
  const token = localStorage.getItem("cusp-token");
  const res = await axios.get(`${API_BASE_URL}/users`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/users/forgot-password`,
    { email },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const changePassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const res = await axios.put(
    `${API_BASE_URL}/users/change-password`,
    { email, otp, newPassword },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};
