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

interface Props {
  tags: Tag[];
  onSuccess?: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

export const CreatePostForm: React.FC<Props> = ({ tags, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };
  const removeVideo = (idx: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== idx));
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
    images.forEach((img) => formData.append("images", img));
    videos.forEach((vid) => formData.append("videos", vid));
    try {
      await createPost(formData);
      toast({ title: "Post created successfully!" });
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setImages([]);
      setVideos([]);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        title: "Failed to create post",
        description: err?.message || "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        Post
      </Button>
    </form>
  );
};
