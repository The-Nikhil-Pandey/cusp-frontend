
import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  tags: string[];
  title: string;
  content: string;
  likes: number;
  comments: number;
  saved: boolean;
  media?: string[];
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    // API Call Here: /api/posts/like
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    // API Call Here: /api/posts/save
    setSaved(!saved);
  };

  return (
    <div className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Media (if any) */}
      {post.media && post.media.length > 0 && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={post.media[0]}
            alt="Post media"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div>
        <h3 className="font-semibold mb-2">{post.title}</h3>
        <p className="text-muted-foreground">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={`${
            saved ? 'text-primary hover:text-primary/80' : 'text-muted-foreground'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
