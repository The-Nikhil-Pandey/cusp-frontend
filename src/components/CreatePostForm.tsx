import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { createPost } from "@/api/post";

interface Tag {
  id: number;
  name: string;
}

interface Upload {
  id: number;
  image: string | null;
  video: string | null;
}

interface Props {
  tags: Tag[];
  initialValues?: {
    title: string;
    description: string;
    selectedTags: number[];
    images: string[];
    videos: string[];
    uploads?: Upload[]; // Pass uploads for edit mode
  };
  editMode?: boolean;
  postId?: number;
  onSuccess?: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

export const CreatePostForm: React.FC<Props> = ({
  tags,
  initialValues,
  editMode,
  postId,
  onSuccess,
}) => {
  // Prefill fields if initialValues provided
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [selectedTags, setSelectedTags] = useState<number[]>(
    initialValues?.selectedTags || []
  );
  // For images/videos, if string URLs, just show as preview, but only allow new uploads for edit
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialValues?.images || []
  );
  const [videos, setVideos] = useState<File[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>(
    initialValues?.videos || []
  );
  // Track removed upload ids for edit mode
  const [removeUploadIds, setRemoveUploadIds] = useState<number[]>([]);
  // Map url to id for quick lookup
  const uploadUrlToId = React.useMemo(() => {
    const map: Record<string, number> = {};
    if (initialValues?.uploads) {
      initialValues.uploads.forEach((u) => {
        if (u.image) map[u.image] = u.id;
        if (u.video) map[u.video] = u.id;
      });
    }
    return map;
  }, [initialValues]);
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  console.log("initialValues", initialValues);

  const handleTagToggle = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const valid = files.filter((file) => file.size <= MAX_IMAGE_SIZE);
    if (valid.length < files.length) {
      toast({ title: "Some images exceed 5MB and were not added." });
    }
    setImages((prev) => [...prev, ...valid]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const valid = files.filter((file) => file.size <= MAX_VIDEO_SIZE);
    if (valid.length < files.length) {
      toast({ title: "Some videos exceed 10MB and were not added." });
    }
    setVideos((prev) => [...prev, ...valid]);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeImage = (idx: number, isUrl = false) => {
    if (isUrl) {
      // Find id from url and add to removeUploadIds
      const url = imageUrls[idx];
      const id = uploadUrlToId[url];
      if (id) setRemoveUploadIds((prev) => [...prev, id]);
      setImageUrls((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== idx));
    }
  };
  const removeVideo = (idx: number, isUrl = false) => {
    if (isUrl) {
      // Find id from url and add to removeUploadIds
      const url = videoUrls[idx];
      const id = uploadUrlToId[url];
      if (id) setRemoveUploadIds((prev) => [...prev, id]);
      setVideoUrls((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setVideos((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({ title: "Title and description are required." });
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    selectedTags.forEach((tag) => formData.append("tags[]", String(tag)));
    // For images: send both existing URLs and new uploads under 'images'
    if (editMode) {
      imageUrls.forEach((url) => formData.append("images", url));
      images.forEach((img) => formData.append("images", img));
      // Add removed upload ids
      removeUploadIds.forEach((id) =>
        formData.append("remove_upload_ids[]", String(id))
      );
    } else {
      images.forEach((img) => formData.append("images", img));
    }
    // For videos: send both existing URLs and new uploads under 'videos'
    if (editMode) {
      videoUrls.forEach((url) => formData.append("videos", url));
      videos.forEach((vid) => formData.append("videos", vid));
      // Already handled above for removeUploadIds
    } else {
      videos.forEach((vid) => formData.append("videos", vid));
    }
    try {
      if (editMode && postId) {
        // PATCH update
        const token = localStorage.getItem("cusp-token");
        await import("@/api/post").then(({ updatePost }) =>
          updatePost(String(postId), formData, token)
        );
        toast({ title: "Post updated successfully!" });
      } else {
        await createPost(formData);
        toast({ title: "Post created successfully!" });
      }
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setImages([]);
      setVideos([]);
      setImageUrls([]);
      setVideoUrls([]);
      setRemoveUploadIds([]);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        title: editMode ? "Failed to update post" : "Failed to create post",
        description: err?.message || "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto "
      style={{
        overflowY: "scroll",
        scrollbarWidth: "thin",

        WebkitOverflowScrolling: "touch",
        scrollbarColor: "transparent transparent",
      }}
    >
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            onClick={() => handleTagToggle(tag.id)}
            className="cursor-pointer"
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      <div>
        <label className="block font-medium mb-1">Images (max 5MB each)</label>
        <Input
          type="file"
          accept="image/*"
          multiple
          ref={imageInputRef}
          onChange={handleImageChange}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {/* Show existing image URLs for edit mode */}
          {imageUrls.map((url, idx) => (
            <div key={url} className="relative w-24 h-24">
              <img
                src={url}
                alt="preview"
                className="object-cover w-full h-full rounded"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-black bg-opacity-60 rounded-full p-1 text-white"
                onClick={() => removeImage(idx, true)}
                title={
                  uploadUrlToId[url]
                    ? `Remove (id: ${uploadUrlToId[url]})`
                    : "Remove"
                }
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {/* Show newly uploaded images */}
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="object-cover w-full h-full rounded"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-black bg-opacity-60 rounded-full p-1 text-white"
                onClick={() => removeImage(idx)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Videos (max 10MB each)</label>
        <Input
          type="file"
          accept="video/*"
          multiple
          ref={videoInputRef}
          onChange={handleVideoChange}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {/* Show existing video URLs for edit mode */}
          {videoUrls.map((url, idx) => (
            <div key={url} className="relative w-32 h-24">
              <video
                src={url}
                controls
                className="object-cover w-full h-full rounded"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-black bg-opacity-60 rounded-full p-1 text-white"
                onClick={() => removeVideo(idx, true)}
                title={
                  uploadUrlToId[url]
                    ? `Remove (id: ${uploadUrlToId[url]})`
                    : "Remove"
                }
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {/* Show newly uploaded videos */}
          {videos.map((vid, idx) => (
            <div key={idx} className="relative w-32 h-24">
              <video
                src={URL.createObjectURL(vid)}
                controls
                className="object-cover w-full h-full rounded"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-black bg-opacity-60 rounded-full p-1 text-white"
                onClick={() => removeVideo(idx)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">
        {editMode ? "Update" : "Post"}
      </Button>
    </form>
  );
};
