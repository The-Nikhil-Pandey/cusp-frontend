// Fetch events from API with Bearer token
type Event = {
  id: number;
  title: string;
  description: string;
  time: string;
  location: string;
  location_url: string;
  event_image: string;
  date: string;
  event_link: string;
  created_at: string;
  updated_at: string | null;
  status: number;
  event_tags: string[];
  user_registered_in_this_event: any[];
};

export async function fetchEvents(token: string): Promise<Event[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${baseUrl}/event/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
