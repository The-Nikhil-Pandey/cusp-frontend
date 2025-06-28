
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, MessageCircle, Heart, Bookmark } from 'lucide-react';
import CreatePostModal from '@/components/CreatePostModal';
import PostCard from '@/components/PostCard';

// Mock data
const mainTags = ['Healthcare', 'Mental Health', 'Community', 'Resources', 'Support'];
const chatTags = ['General', 'Questions', 'Advice', 'Events', 'Introductions'];

const upcomingEvents = [
  {
    id: 1,
    title: 'Mental Health Workshop',
    date: '2024-01-15',
    time: '14:00',
    location: 'Community Center'
  },
  {
    id: 2,
    title: 'Networking Event',
    date: '2024-01-18',
    time: '18:30',
    location: 'Downtown Hall'
  }
];

const trendingPosts = [
  {
    id: 1,
    author: { name: 'Sarah Johnson', avatar: '/placeholder.svg' },
    timestamp: '2 hours ago',
    tags: ['Mental Health'],
    title: 'Supporting Youth in Crisis',
    content: 'Sharing some insights from our recent youth crisis intervention training...',
    likes: 24,
    comments: 8,
    saved: false
  },
  {
    id: 2,
    author: { name: 'Mike Chen', avatar: '/placeholder.svg' },
    timestamp: '4 hours ago',
    tags: ['Healthcare'],
    title: 'New Healthcare Guidelines',
    content: 'The new guidelines for community healthcare workers are now available...',
    likes: 18,
    comments: 12,
    saved: true
  }
];

const Dashboard = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const filteredPosts = selectedTag
    ? trendingPosts.filter(post => post.tags.includes(selectedTag))
    : trendingPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
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
                  Connect with fellow social care professionals and build a supportive community.
                </p>
              </CardContent>
            </Card>

            {/* Main Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Main Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mainTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
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
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome to CUSP Community
              </h1>
              <p className="text-muted-foreground">
                Connect, share, and grow with social care professionals worldwide.
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
                      Thank you for joining CUSP! This platform is designed to help social care 
                      professionals like you connect, share experiences, and support each other. 
                      Start by creating your first post or exploring what others are sharing.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Events */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingEvents.slice(0, 2).map((event) => (
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

            {/* Trending Posts Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedTag ? `Posts tagged with "${selectedTag}"` : 'Trending Posts'}
                  </CardTitle>
                  <CardDescription>
                    Discover what the community is talking about
                  </CardDescription>
                </div>
                <Button onClick={() => setCreatePostOpen(true)}>
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

      <CreatePostModal open={createPostOpen} onOpenChange={setCreatePostOpen} />
    </div>
  );
};

export default Dashboard;
