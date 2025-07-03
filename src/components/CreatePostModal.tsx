import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchTags, Tag } from "@/api/tags";
import { CreatePostForm } from "./CreatePostForm";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onOpenChange,
}) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        {loadingTags ? (
          <div className="p-4">Loading tags...</div>
        ) : errorTags ? (
          <div className="p-4 text-red-500">{errorTags}</div>
        ) : (
          <CreatePostForm tags={tags} onSuccess={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
