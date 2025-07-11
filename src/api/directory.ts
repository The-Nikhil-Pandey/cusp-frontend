import axios from "axios";

export interface DirectoryEntry {
  id: number;
  place_name: string;
  location: string;
  location_url: string;
  p_name: string;
  p_email: string;
  p_photo: string;
  p_phone?: string;
  created_at: string;
  updated_at: string | null;
  status: number;
}

export async function fetchDirectories(): Promise<DirectoryEntry[]> {
  const response = await axios.get("http://31.97.56.234:8000/api/directory/");
  return response.data;
}
