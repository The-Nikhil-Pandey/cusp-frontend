export interface ToolEntry {
  id: number;
  title: string;
  description: string;
  link: string;
  img_url: string;
  created_at: string;
  updated_at: string;
  status: number;
}

export async function fetchTools(): Promise<ToolEntry[]> {
  const res = await fetch("http://31.97.56.234:8000/api/tools/");
  if (!res.ok) throw new Error("Failed to fetch tools");
  return res.json();
}
