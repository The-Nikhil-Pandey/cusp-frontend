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
  const res = await fetch("https://api.dreamsquats.co.uk/api/tools/");
  if (!res.ok) throw new Error("Failed to fetch tools");
  return res.json();
}
