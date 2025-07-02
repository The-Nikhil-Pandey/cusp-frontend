import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchTags, Tag } from "@/api/tags";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [media, setMedia] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const { toast } = useToast();

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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      // API Call Here: /api/posts/create
      console.log("Creating post:", {
        title,
        description,
        selectedTags,
        media,
      });

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setMedia(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to share?"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about your thoughts..."
              className="mt-1 min-h-32"
              required
            />
          </div>

          <div>
            <Label htmlFor="media">Media (Images/Videos) - Optional</Label>
            <Input
              id="media"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setMedia(e.target.files)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Tags (Optional)</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {loadingTags && <span>Loading tags...</span>}
              {errorTags && <span className="text-red-500">{errorTags}</span>}
              {!loadingTags &&
                !errorTags &&
                tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      selectedTags.includes(tag.name) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim() || !description.trim()}
            >
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
