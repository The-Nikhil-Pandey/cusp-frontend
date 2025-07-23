import React, { useEffect, useState } from "react";
import { fetchTools, ToolEntry } from "@/api/tools";
import { Wrench } from "lucide-react";

const Tools: React.FC = () => {
  const [tools, setTools] = useState<ToolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTools()
      .then(setTools)
      .catch(() => setError("Failed to load tools."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Wrench className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Tools</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="group bg-gradient-to-br bg-background rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden transition-transform hover:scale-[1.03] hover:shadow-2xl duration-200"
          >
            <div className="relative w-full aspect-[4/2] bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={
                  tool.img_url
                    ? `https://api.dreamsquats.co.uk/uploads/${tool.img_url}`
                    : "/placeholder.svg"
                }
                alt={tool.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {tool.status !== 1 && (
                <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-1 rounded shadow">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col p-5 gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg text-foreground line-clamp-1">
                  {tool.title}
                </span>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-3 mb-2 min-h-[48px]">
                {tool.description}
              </div>
              {tool.link && (
                <a
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow hover:bg-primary/90 transition-colors w-fit mt-1"
                >
                  <span>Visit Link</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75V17.25M17.25 6.75H6.75M17.25 6.75L6.75 17.25"
                    />
                  </svg>
                </a>
              )}
              <div className="flex-1" />
              <div className="flex justify-end mt-3">
                <span className="bg-accent/40 text-xs px-3 py-1 rounded-full text-muted-foreground">
                  Created: {new Date(tool.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tools;
