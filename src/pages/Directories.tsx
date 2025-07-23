import React, { useEffect, useState } from "react";
import { fetchDirectories, DirectoryEntry } from "@/api/directory";
import { Folder } from "lucide-react";

const Directories: React.FC = () => {
  const [directories, setDirectories] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDirectories()
      .then(setDirectories)
      .catch(() => setError("Failed to load directories."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Folder className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Directories</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {directories.map((dir) => (
          <div
            key={dir.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-3 border border-border"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  dir.p_photo
                    ? `https://api.dreamsquats.co.uk/uploads/${dir.p_photo}`
                    : "/placeholder.svg"
                }
                alt={dir.p_name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <div className="font-semibold text-lg">{dir.place_name}</div>
                <div className="text-sm text-muted-foreground">
                  {dir.p_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dir.p_email}
                </div>
                {dir.p_phone && (
                  <div className="text-xs text-muted-foreground">
                    {dir.p_phone}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <div className="font-medium">Location:</div>
              <div className="text-sm">{dir.location}</div>
            </div>
            <div className="mt-2">
              <iframe
                src={
                  dir.location_url.includes("/maps")
                    ? dir.location_url
                    : `https://maps.google.com/maps?q=${encodeURIComponent(
                        dir.location_url
                      )}&output=embed`
                }
                title="Google Map"
                className="w-full h-40 rounded border"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Created: {new Date(dir.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directories;
