
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Users, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const mockMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'New York, NY',
    profilePic: '/placeholder.svg',
    tags: ['Mental Health', 'Counseling'],
    joinedDate: '2023-06-15'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'Los Angeles, CA',
    profilePic: '/placeholder.svg',
    tags: ['Healthcare', 'Community'],
    joinedDate: '2023-05-20'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    location: 'Chicago, IL',
    profilePic: '/placeholder.svg',
    tags: ['Childcare', 'Education'],
    joinedDate: '2023-07-02'
  }
];

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Members</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Connect with {mockMembers.length} social care professionals in our community
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedMember(member)}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.profilePic} />
                  <AvatarFallback className="text-lg">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{member.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {member.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No members found matching your search.</p>
        </div>
      )}

      {/* Member Details Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedMember.profilePic} />
                  <AvatarFallback className="text-2xl">{selectedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedMember.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Member Since</h4>
                <p className="text-muted-foreground">
                  {new Date(selectedMember.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;
