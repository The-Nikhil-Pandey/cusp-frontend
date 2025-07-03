import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTags, Tag } from "@/api/tags";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [apiUser, setApiUser] = useState<any>(null);

  useEffect(() => {
    fetchTags().then(setTags);
    // Fetch user details from API
    fetch(`${API_BASE_URL}/users/${user?.id}`)
      .then((res) => res.json())
      .then((data) => setApiUser(data));
  }, [user?.id]);

  if (!user || !apiUser) return null;

  // Helper to parse tag_id from API (stringified array)
  const parseApiTagIds = (tagId: any) => {
    if (Array.isArray(tagId)) return tagId;
    if (typeof tagId === "string") {
      try {
        return JSON.parse(tagId);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Compare and update user details if different from API
  const mergedUser = {
    ...user,
    fullName:
      apiUser.username !== user.fullName ? apiUser.username : user.fullName,
    email: apiUser.email !== user.email ? apiUser.email : user.email,
    phone: apiUser.phone !== user.phone ? apiUser.phone : user.phone,
    address: apiUser.address !== user.address ? apiUser.address : user.address,
    jobTitle:
      apiUser.job_title !== user.jobTitle ? apiUser.job_title : user.jobTitle,
    company:
      apiUser.company_name !== user.company
        ? apiUser.company_name
        : user.company,
    profileImage:
      apiUser.profile_photo !== user.profileImage
        ? apiUser.profile_photo
        : user.profileImage,
    headline:
      apiUser.headline !== user.headline ? apiUser.headline : user.headline,
    language:
      apiUser.language !== user.language ? apiUser.language : user.language,
    timezone:
      apiUser.timezone !== user.timezone ? apiUser.timezone : user.timezone,
    tag_id:
      JSON.stringify(apiUser.tag_id) !== JSON.stringify(user.tag_id)
        ? parseApiTagIds(apiUser.tag_id)
        : user.tag_id,
    que1: apiUser.que1 !== user.que1 ? apiUser.que1 : user.que1,
    que2: apiUser.que2 !== user.que2 ? apiUser.que2 : user.que2,
    joinedDate:
      apiUser.created_at !== user.joinedDate
        ? apiUser.created_at
        : user.joinedDate,
  };

  const tagIds: number[] = Array.isArray(mergedUser.tag_id)
    ? mergedUser.tag_id
    : [];
  const tagNames = tagIds
    .map((id) => tags.find((t) => t.id === id)?.name)
    .filter(Boolean);

  console.log("user", mergedUser);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl  max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mergedUser.profileImage} />
              <AvatarFallback className="text-2xl">
                {mergedUser.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{mergedUser.fullName}</h3>
              <p className="text-muted-foreground">{mergedUser.email}</p>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(mergedUser.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Job Title</h4>
              <p className="text-muted-foreground">
                {mergedUser.jobTitle || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Company</h4>
              <p className="text-muted-foreground">
                {mergedUser.company || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Timezone</h4>
              <p className="text-muted-foreground">
                {mergedUser.timezone || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Language</h4>
              <p className="text-muted-foreground">
                {mergedUser.language || "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Social Care Work</h4>
            <div className="flex flex-wrap gap-2">
              {tagNames.length > 0 ? (
                tagNames.map((name) => (
                  <Badge key={name} variant="secondary">
                    {name}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Headline</h4>
            <p className="text-muted-foreground">
              {mergedUser.headline || "Not specified"}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Phone</h4>
            <p className="text-muted-foreground">
              {mergedUser.phone || "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">
              Are you planning to open a squat practice?
            </h4>
            <p className="text-muted-foreground">
              {mergedUser.que1
                ? mergedUser.que1.charAt(0).toUpperCase() +
                  mergedUser.que1.slice(1)
                : "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Are you a supplier?</h4>
            <p className="text-muted-foreground">
              {mergedUser.que2
                ? mergedUser.que2.charAt(0).toUpperCase() +
                  mergedUser.que2.slice(1)
                : "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Address</h4>
            <p className="text-muted-foreground">
              {mergedUser.address || "Not specified"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
