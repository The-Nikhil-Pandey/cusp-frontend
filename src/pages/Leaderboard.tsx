
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const leaderboardData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    score: 2450,
    posts: 45,
    likes: 320,
    comments: 185
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: '/placeholder.svg',
    score: 2280,
    posts: 38,
    likes: 290,
    comments: 165
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: '/placeholder.svg',
    score: 2100,
    posts: 32,
    likes: 245,
    comments: 140
  },
  {
    id: 4,
    name: 'John Davis',
    avatar: '/placeholder.svg',
    score: 1950,
    posts: 28,
    likes: 210,
    comments: 125
  },
  {
    id: 5,
    name: 'Lisa Brown',
    avatar: '/placeholder.svg',
    score: 1820,
    posts: 25,
    likes: 195,
    comments: 110
  }
];

const Leaderboard = () => {
  const { user } = useAuth();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          Top contributors in our social care community
        </p>
      </div>

      {/* Current User Info */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Your Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="text-lg">{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user?.fullName}</h3>
              <div className="grid grid-cols-4 gap-4 mt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">15</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">89</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">42</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">1250</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              #12
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>
            Rankings based on community engagement and contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((member, index) => {
              const rank = index + 1;
              return (
                <div
                  key={member.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    rank <= 3 ? 'bg-accent/30 border-primary/20' : 'bg-background'
                  }`}
                >
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(rank)}
                  </div>
                  
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span>{member.posts} posts</span>
                      <span>{member.likes} likes</span>
                      <span>{member.comments} comments</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{member.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
