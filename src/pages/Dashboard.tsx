import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  MessageCircle,
  Heart,
  Bookmark,
  ChevronDown,
  X,
} from "lucide-react";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";
import { fetchTags, Tag } from "@/api/tags";
import * as Select from "@radix-ui/react-select";

const chatTags = ["General", "Questions", "Advice", "Events", "Introductions"];

const upcomingEvents = [
  {
    id: 1,
    title: "Mental Health Workshop",
    date: "2024-01-15",
    time: "14:00",
    location: "Community Center",
  },
  {
    id: 2,
    title: "Networking Event",
    date: "2024-01-18",
    time: "18:30",
    location: "Downtown Hall",
  },
];

const trendingPosts = [
  {
    id: 1,
    author: { name: "Sarah Johnson", avatar: "/placeholder.svg" },
    timestamp: "2 hours ago",
    tags: ["🧠 Mindset & Ownership"],
    title: "Supporting Youth in Crisis",
    content:
      "Sharing some insights from our recent youth crisis intervention training...",
    likes: 24,
    comments: 8,
    saved: false,
  },
  {
    id: 2,
    author: { name: "Mike Chen", avatar: "/placeholder.svg" },
    timestamp: "4 hours ago",
    tags: ["📍Start Your Squat"],
    title: "New Healthcare Guidelines",
    content:
      "The new guidelines for community healthcare workers are now available...",
    likes: 18,
    comments: 12,
    saved: true,
  },
];

const Dashboard = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getTags = async () => {
      setLoadingTags(true);
      setErrorTags(null);
      try {
        const data = await fetchTags();
        setTags(data);
      } catch (err) {
        setErrorTags("Failed to load tags");
      } finally {
        setLoadingTags(false);
      }
    };
    getTags();
  }, []);

  const mainTags = showAllTags ? tags : tags.slice(0, 5);

  const filteredPosts = selectedTag
    ? trendingPosts.filter((post) => post.tags.includes(selectedTag))
    : trendingPosts;

  // Responsive helpers
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!tagDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node)
      ) {
        setTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [tagDropdownOpen]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
      {/* Welcome Message (always at top on mobile/tablet) */}
      <div className="block lg:hidden mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to CUSP</CardTitle>
            <CardDescription>
              Stay connected with your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Thank you for joining CUSP! This platform is designed to help
              social care professionals like you connect, share experiences, and
              support each other. Start by creating your first post or exploring
              what others are sharing.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar as horizontal scrollable bar on mobile/tablet */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {/* Feed */}
        <Button
          variant={selectedTag === null ? "default" : "ghost"}
          className="shrink-0"
          onClick={() => setSelectedTag(null)}
        >
          All Posts
        </Button>
        {/* Tags Dropdown */}
        <Select.Root
          value={selectedTag ?? ""}
          onValueChange={(value) => setSelectedTag(value || null)}
        >
          <Select.Trigger
            className="inline-flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors  min-w-[120px] shrink-0 data-[placeholder]:text-muted-foreground"
            aria-label="Topics"
          >
            {selectedTag ? (
              <span className="flex items-center gap-1">
                <Badge variant="secondary">{selectedTag}</Badge>
                <X
                  className="h-4 w-4 cursor-pointer ml-1 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTag(null);
                  }}
                />
              </span>
            ) : (
              <>
                <span className="text-muted-foreground">Topics</span>
                <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
              </>
            )}
          </Select.Trigger>
          <Select.Content
            className="z-50 bg-popover border border-border rounded-md shadow-lg mt-1 animate-in fade-in-0 slide-in-from-top-2"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="max-h-60 overflow-y-auto p-1">
              {loadingTags && (
                <div className="p-2 text-sm text-muted-foreground">
                  Loading tags...
                </div>
              )}
              {errorTags && (
                <div className="p-2 text-sm text-destructive">{errorTags}</div>
              )}
              {!loadingTags &&
                !errorTags &&
                tags.map((tag) => (
                  <Select.Item
                    key={tag.id}
                    value={tag.name}
                    className="flex items-center px-3 py-2 rounded-md cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none select-none transition-colors"
                  >
                    <Select.ItemText>{tag.name}</Select.ItemText>
                  </Select.Item>
                ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
        {/* CUSP Chats */}
        <div className="flex gap-1 shrink-0">
          {chatTags.map((tag) => (
            <Button key={tag} variant="ghost" className="shrink-0" size="sm">
              #{tag}
            </Button>
          ))}
        </div>
        {/* Community Guidelines */}
        <Button variant="link" className="shrink-0 p-0 h-auto text-primary">
          Community Guidelines
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="space-y-6 sticky top-24">
            {/* Feed Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedTag === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTag(null)}
                >
                  All Posts
                </Button>
              </CardContent>
            </Card>

            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Welcome to CUSP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with fellow social care professionals and build a
                  supportive community.
                </p>
              </CardContent>
            </Card>

            {/* Main Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Main Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadingTags && <p>Loading tags...</p>}
                {errorTags && <p className="text-red-500">{errorTags}</p>}
                {!loadingTags &&
                  !errorTags &&
                  mainTags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={selectedTag === tag.name ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedTag(tag.name)}
                    >
                      {tag.name}
                    </Button>
                  ))}
                {!showAllTags && tags.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs mt-2"
                    onClick={() => setShowAllTags(true)}
                  >
                    More...
                  </Button>
                )}
                {showAllTags && tags.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs mt-2"
                    onClick={() => setShowAllTags(false)}
                  >
                    Show Less
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* CUSP Chats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CUSP Chats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {chatTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    # {tag}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Links</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Community Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-3">
          <div className="space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome to CUSP Community
              </h1>
              <p className="text-muted-foreground">
                Connect, share, and grow with social care professionals
                worldwide.
              </p>
            </div>

            {/* Welcome Message & Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Welcome Message */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Message</CardTitle>
                    <CardDescription>
                      Stay connected with your community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Thank you for joining CUSP! This platform is designed to
                      help social care professionals like you connect, share
                      experiences, and support each other. Start by creating
                      your first post or exploring what others are sharing.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events (hide on <lg screens) */}
              <div className="lg:col-span-1 hidden lg:block">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-3 space-y-1"
                      >
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date} at {event.time}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Events
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* More Events Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.slice(2, 5).map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{event.title}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.date} at {event.time}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trending Posts Section (for lg and up) */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <CardTitle>
                    {selectedTag
                      ? `Posts tagged with "${selectedTag}"`
                      : "Trending Posts"}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Discover what the community is talking about
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setCreatePostOpen(true)}
                  className="mt-2 sm:mt-0"
                >
                  Start New Post
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {filteredPosts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No posts found for the selected tag.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Main Content */}
      <div className="lg:hidden space-y-4">
        {/* Upcoming Events stacked (hide on tab/phone view) */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-3 space-y-1">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {event.date} at {event.time}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All Events
            </Button>
          </CardContent>
        </Card> */}
        {/* Trending Posts Section (always at bottom on mobile/tablet) */}
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle>
                  {selectedTag
                    ? `Posts tagged with "${selectedTag}"`
                    : "Trending Posts"}
                </CardTitle>
                <CardDescription className="mt-2">
                  Discover what the community is talking about
                </CardDescription>
              </div>
              <Button
                onClick={() => setCreatePostOpen(true)}
                className="mt-2 sm:mt-0"
              >
                Start New Post
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {filteredPosts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No posts found for the selected tag.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePostModal open={createPostOpen} onOpenChange={setCreatePostOpen} />
      {/* Hide scrollbar utility */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
