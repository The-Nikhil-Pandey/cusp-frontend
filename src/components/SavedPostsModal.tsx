import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostCard from "./PostCard";

interface SavedPostsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SavedPostsModal: React.FC<SavedPostsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const savedPosts = [
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
      saved: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Posts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {savedPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No saved posts yet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavedPostsModal;
