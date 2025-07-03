import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostCard from "./PostCard";
import { fetchPosts } from "@/api/post";
import { fetchUserById } from "@/api/userApi";
import { useAuth } from "@/contexts/AuthContext";

interface SavedPostsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SavedPostsModal: React.FC<SavedPostsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const [allPosts, userData] = await Promise.all([
          fetchPosts(),
          fetchUserById(user.id),
        ]);
        const savedIds =
          userData.saved_post_ids?.map((id: string | number) => Number(id)) ||
          [];
        const filtered = allPosts.filter((p: any) =>
          savedIds.includes(Number(p.id))
        );
        setSavedPosts(
          filtered.map((p: any) => ({
            id: p.id,
            author: { name: p.username, avatar: "/placeholder.svg" },
            timestamp: new Date(p.created_at).toLocaleString(),
            tags: p.tags.map((t: any) => t.tag_title),
            title: p.title,
            content: p.description,
            likes: Number(p.likes),
            comments: Number(p.comments),
            saved: true,
            media: p.uploads
              ? p.uploads
                  .map((u: any) =>
                    u.image || u.video
                      ? `${import.meta.env.VITE_API_BASE_URL.replace(
                          /\/api$/,
                          ""
                        )}${u.image || u.video}`
                      : null
                  )
                  .filter(Boolean)
              : [],
          }))
        );
      } catch (e) {
        setError("Failed to load saved posts");
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchSaved();
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Posts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading && <p>Loading saved posts...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            savedPosts.map((post) => <PostCard key={post.id} post={post} />)}
          {!loading && !error && savedPosts.length === 0 && (
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
