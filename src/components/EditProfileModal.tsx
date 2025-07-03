import React, { useEffect, useState } from "react";
import { fetchTags, Tag } from "@/api/tags";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile } from "@/api/user";
import { X } from "lucide-react";

const timezones = [
  "UTC",
  "EST",
  "CST",
  "MST",
  "PST",
  "GMT",
  "CET",
  "JST",
  "AEST",
  "IST",
];

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Russian",
  "Portuguese",
];

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || "");
  const [company, setCompany] = useState(user?.company || "");
  const [timezone, setTimezone] = useState(user?.timezone || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    user?.socialCareWork || []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    Array.isArray(user?.tag_id) ? user?.tag_id : []
  );
  const [language, setLanguage] = useState(user?.language || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [que1, setQue1] = useState(user?.que1 || "");
  const [que2, setQue2] = useState(user?.que2 || "");
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user?.profileImage || null
  );
  const [imageError, setImageError] = useState<string>("");

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

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setImageError("Image size should not exceed 3MB.");
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setProfileImagePreview(user?.profileImage || null);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    setImageError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("jobTitle", jobTitle);
      formData.append("company", company);
      formData.append("timezone", timezone);
      formData.append("tag_id", JSON.stringify(selectedTagIds));
      formData.append("language", language);
      formData.append("headline", headline);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("que1", que1);
      formData.append("que2", que2);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await updateUserProfile(
        formData,
        localStorage.getItem("cusp-token") || ""
      );
      console.log("token", localStorage.getItem("cusp-token"));

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc #f0f0f0" }}
      >
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div>
            <Label htmlFor="profileImage">Profile Image (Optional)</Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="mt-1"
              disabled={!!profileImage}
            />
            {imageError && (
              <div className="text-red-500 text-xs mt-1">{imageError}</div>
            )}
            {profileImagePreview && (
              <div className="relative mt-3 w-32 h-32 rounded-lg overflow-hidden border border-primary/30 bg-muted flex items-center justify-center">
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-background rounded-full p-1 shadow hover:bg-primary/10 transition"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Social Care Work</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {loadingTags && <span>Loading tags...</span>}
              {errorTags && <span className="text-red-500">{errorTags}</span>}
              {!loadingTags &&
                !errorTags &&
                tags.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleTag(option.id)}
                    className={`cursor-pointer p-2 rounded-md border text-sm transition-colors ${
                      selectedTagIds.includes(option.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {option.name}
                  </div>
                ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Headline */}
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., Passionate Social Worker, Community Leader"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +91 9876543210"
              className="mt-1 bg-background border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="mt-1 bg-background border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              required
            />
          </div>

          <div>
            <Label>Are you planning to open a squat practice?</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={que1 === "yes" ? "default" : "outline"}
                onClick={() => setQue1("yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={que1 === "no" ? "default" : "outline"}
                onClick={() => setQue1("no")}
              >
                No
              </Button>
            </div>
          </div>
          <div>
            <Label>Are you a supplier?</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={que2 === "yes" ? "default" : "outline"}
                onClick={() => setQue2("yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={que2 === "no" ? "default" : "outline"}
                onClick={() => setQue2("no")}
              >
                No
              </Button>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
