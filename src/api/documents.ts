import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchDocuments(token: string) {
  const res = await axios.get(`${API_BASE_URL}/documents/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchDocumentById(id: number, token: string) {
  const res = await axios.get(`${API_BASE_URL}/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data[0];
}

export async function addDocument(data: FormData, token: string) {
  const res = await axios.post(`${API_BASE_URL}/documents`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function editDocument(id: number, data: FormData, token: string) {
  const res = await axios.patch(`${API_BASE_URL}/documents/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteDocument(id: number, token: string) {
  const res = await axios.delete(`${API_BASE_URL}/documents/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
