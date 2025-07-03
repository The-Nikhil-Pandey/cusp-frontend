import React, { useState } from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { likePost, savePost, unsavePost } from "@/api/post";

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
  const { user, updateProfile } = useAuth();
  // Check if user has liked this post
  const initialLiked = user?.user_likes?.includes(post.id) || false;
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    setLikeLoading(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    try {
      await likePost(post.id.toString(), newLiked ? "yes" : "no");
      // Update user context for likes (optional, for instant UI update everywhere)
      if (user.user_likes) {
        let updatedLikes = newLiked
          ? [...user.user_likes, post.id]
          : user.user_likes.filter((id) => id !== post.id);
        updateProfile({ user_likes: updatedLikes });
      }
    } catch (e) {
      // Revert UI if API fails
      setLiked(!newLiked);
      setLikeCount((prev) => (!newLiked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const [saveLoading, setSaveLoading] = useState(false);
  const handleSave = async () => {
    if (!user) return;
    setSaveLoading(true);
    try {
      if (!saved) {
        await savePost(post.id.toString());
        setSaved(true);
      } else {
        await unsavePost(post.id.toString());
        setSaved(false);
      }
    } catch (e) {
      // Optionally show error toast
    } finally {
      setSaveLoading(false);
    }
  };

  const openMediaModal = (idx: number) => {
    setMediaIndex(idx);
    setMediaModalOpen(true);
  };

  const closeMediaModal = () => setMediaModalOpen(false);
  const prevMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMediaIndex((prev) =>
      prev === 0 ? (post.media?.length || 1) - 1 : prev - 1
    );
  };
  const nextMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMediaIndex((prev) =>
      post.media && prev === post.media.length - 1 ? 0 : prev + 1
    );
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

      {/* Media Collage */}
      {post.media && post.media.length > 0 && (
        <div className="w-full">
          <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden max-h-52 min-h-[120px]">
            {post.media.slice(0, 3).map((url, idx) => (
              <div
                key={url}
                className={`relative cursor-pointer group aspect-square bg-muted flex items-center justify-center ${
                  idx === 2 && post.media.length > 3 ? "col-span-1" : ""
                }`}
                onClick={() => openMediaModal(idx)}
              >
                {url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={url}
                    className="object-cover w-full h-full"
                    muted
                    playsInline
                    poster={undefined}
                    preload="metadata"
                    onLoadedData={(e) => {
                      const video = e.currentTarget;
                      video.currentTime = 0.1;
                    }}
                  />
                ) : (
                  <img
                    src={url}
                    alt="Post media"
                    className="object-cover w-full h-full"
                  />
                )}
                {/* Video play icon overlay */}
                {url.match(/\.(mp4|webm|ogg)$/i) && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.5)" />
                      <polygon points="16,13 28,20 16,27" fill="#fff" />
                    </svg>
                  </span>
                )}
                {/* Overlay for +N more */}
                {idx === 2 && post.media.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      +{post.media.length - 3}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Modal */}
      {mediaModalOpen && post.media && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeMediaModal}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            onClick={prevMedia}
          >
            &#8592;
          </button>
          <div className="max-w-full max-h-full flex items-center justify-center">
            {post.media[mediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={post.media[mediaIndex]}
                className="max-h-[80vh] max-w-[90vw] rounded-lg"
                controls
                autoPlay
              />
            ) : (
              <img
                src={post.media[mediaIndex]}
                alt="Post media"
                className="max-h-[80vh] max-w-[90vw] rounded-lg"
              />
            )}
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            onClick={nextMedia}
          >
            &#8594;
          </button>
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeMediaModal}
          >
            &times;
          </button>
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
            disabled={likeLoading}
            className={`flex items-center space-x-1 ${
              liked
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
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
          disabled={saveLoading}
          className={`${
            saved
              ? "text-primary hover:text-primary/80"
              : "text-muted-foreground"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
