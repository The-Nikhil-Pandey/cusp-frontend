
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

const upcomingEvents = [
  {
    id: 1,
    title: 'Mental Health First Aid Workshop',
    date: '2024-01-15',
    time: '14:00',
    day: 'Monday',
    location: 'Community Center, 123 Main St',
    description: 'Learn essential skills to help someone experiencing a mental health crisis.',
    banner: '/placeholder.svg',
    metadata: ['Free Event', 'Certification Available', 'Refreshments Provided']
  },
  {
    id: 2,
    title: 'Social Care Networking Event',
    date: '2024-01-18',
    time: '18:30',
    day: 'Thursday',
    location: 'Downtown Hall, Conference Room A',
    description: 'Connect with fellow social care professionals in your area.',
    banner: '/placeholder.svg',
    metadata: ['Networking', 'Light Dinner', 'RSVP Required']
  }
];

const pastEvents = [
  {
    id: 3,
    title: 'Crisis Intervention Training',
    date: '2023-12-10',
    venue: 'City Training Center',
    banner: '/placeholder.svg'
  },
  {
    id: 4,
    title: 'Community Outreach Planning',
    date: '2023-11-25',
    venue: 'Community Hall',
    banner: '/placeholder.svg'
  }
];

const Events = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
        <p className="text-muted-foreground">Discover and attend social care community events</p>
      </div>

      {/* Tab Toggle */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={activeTab === 'past' ? 'default' : 'outline'}
          onClick={() => setActiveTab('past')}
        >
          Past
        </Button>
      </div>

      {activeTab === 'upcoming' && (
        <div className="space-y-8">
          {/* Next Upcoming Event */}
          {upcomingEvents.length > 0 && (
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {upcomingEvents[0].title}
                  </h2>
                  <p className="text-muted-foreground">Next Event</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{upcomingEvents[0].date} ({upcomingEvents[0].day})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{upcomingEvents[0].time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{upcomingEvents[0].location}</span>
                    </div>
                    <p className="text-foreground">{upcomingEvents[0].description}</p>
                    <div className="flex flex-wrap gap-2">
                      {upcomingEvents[0].metadata.map((item, index) => (
                        <Badge key={index} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                    <Button className="w-full sm:w-auto">Register Now</Button>
                  </div>
                  <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
                    <p className="text-muted-foreground">Event Location Map</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Future Events */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">All Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-3">{event.description}</p>
                        <Button size="sm">Learn More</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'past' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Past Events</h3>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
