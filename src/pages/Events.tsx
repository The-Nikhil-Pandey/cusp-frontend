import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { fetchEvents } from "@/api/event";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://31.97.56.234:8000";
const DEFAULT_EVENT_IMAGE = "/placeholder.svg";

function getDayName(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

function getEmbedMapUrl(url: string) {
  try {
    if (!url) return null;
    // Google Maps place or search link
    if (
      url.includes("google.com/maps/place/") ||
      url.includes("google.com/maps/search/")
    ) {
      // Extract the place/query part
      const match = url.match(/google.com\/maps\/(?:place|search)\/([^/?]+)/);
      if (match && match[1]) {
        const place = decodeURIComponent(match[1]);
        return `https://maps.google.com/maps?q=${encodeURIComponent(
          place
        )}&output=embed`;
      }
    }
    // If already an embed link
    if (url.includes("/maps/embed")) return url;
    // Fallback: try to use as query
    if (url.includes("google.com/maps")) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(
        url
      )}&output=embed`;
    }
    return null;
  } catch {
    return null;
  }
}

function getEventImageUrl(event_image: string | undefined) {
  if (!event_image) return DEFAULT_EVENT_IMAGE;
  if (event_image.startsWith("http")) return event_image;
  if (event_image.startsWith("/uploads/"))
    return `${API_BASE_URL}${event_image}`;
  return DEFAULT_EVENT_IMAGE;
}

const Events = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedPastEvent, setSelectedPastEvent] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("cusp-token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }
    fetchEvents(token)
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
        <p className="text-muted-foreground">
          Discover and attend social care community events
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
        >
          Past
        </Button>
      </div>

      {loading && <div>Loading events...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && activeTab === "upcoming" && (
        <div className="space-y-8">
          {/* Top Detailed Event */}
          {selectedEvent && (
            <Card className="overflow-hidden">
              <div
                className="relative aspect-video w-full flex items-center justify-center bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getEventImageUrl(
                    selectedEvent.event_image
                  )})`,
                }}
              >
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg text-center px-2">
                    {selectedEvent.title}
                  </h2>
                  <p className=" text-white/80 text-center">Next Event</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(selectedEvent.date)} (
                        {getDayName(selectedEvent.date)})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <p className="text-foreground">
                      {selectedEvent.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.event_tags.map(
                        (item: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        )
                      )}
                    </div>
                    <a
                      href={selectedEvent.event_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full sm:w-auto">Register Now</Button>
                    </a>
                  </div>
                  <div className="bg-accent-foreground rounded-lg p-2 flex items-center justify-center w-full h-full min-h-[200px]">
                    {getEmbedMapUrl(selectedEvent.location_url) ? (
                      <iframe
                        src={getEmbedMapUrl(selectedEvent.location_url)}
                        title="Event Location Map"
                        className="w-full h-60 rounded-lg border-none"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    ) : (
                      <p className="text-muted-foreground">
                        Map preview not available.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Upcoming Events */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">All Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-lg font-medium col-span-full">
                  No upcoming events.
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden border border-border/60 bg-background/80 backdrop-blur-md"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div
                      className="relative h-40 w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${getEventImageUrl(
                          event.event_image
                        )})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                        <h4
                          className="font-semibold text-lg text-white drop-shadow mb-1 truncate"
                          title={event.title}
                        >
                          {event.title}
                        </h4>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {event.event_tags.map((tag: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDate(event.date)} at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate" title={event.location}>
                            {event.location}
                          </span>
                        </div>
                        <p className="text-xs text-foreground line-clamp-2 mb-2">
                          {event.description}
                        </p>
                        <Button
                          size="sm"
                          className="w-full mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && activeTab === "past" && (
        <div className="space-y-6">
          {selectedPastEvent && (
            <Card className="overflow-hidden">
              <div
                className="aspect-video w-full flex items-center justify-center bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getEventImageUrl(
                    selectedPastEvent.event_image
                  )})`,
                }}
              >
                <div className="text-center bg-black/40 w-full h-full flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {selectedPastEvent.title}
                  </h2>
                  <p className="text-muted-foreground">Past Event</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(selectedPastEvent.date)} (
                        {getDayName(selectedPastEvent.date)})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{selectedPastEvent.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedPastEvent.location}</span>
                    </div>
                    <p className="text-foreground">
                      {selectedPastEvent.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPastEvent.event_tags.map(
                        (item: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <div className="bg-accent-foreground rounded-lg p-2 flex items-center justify-center w-full h-full min-h-[200px]">
                    {getEmbedMapUrl(selectedPastEvent.location_url) ? (
                      <iframe
                        src={getEmbedMapUrl(selectedPastEvent.location_url)}
                        title="Event Location Map"
                        className="w-full h-60 rounded-lg border-none"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    ) : (
                      <p className="text-muted-foreground">
                        Map preview not available.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <h3 className="text-xl font-semibold">Past Events</h3>
          <div className="space-y-4">
            {pastEvents.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-lg font-medium">
                No past events.
              </div>
            ) : (
              pastEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPastEvent(event)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div
                        className="w-full sm:w-24 h-24 rounded-lg flex items-center justify-center bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${getEventImageUrl(
                            event.event_image
                          )})`,
                        }}
                      >
                        {/* Empty for image bg */}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">
                          {event.title}
                        </h4>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-3">{event.description}</p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPastEvent(event);
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
