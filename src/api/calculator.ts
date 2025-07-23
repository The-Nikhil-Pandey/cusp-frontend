import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const submitCalculatorForm = async (formData: any, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculator`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
