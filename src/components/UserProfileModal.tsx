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

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchTags().then(setTags);
  }, []);

  if (!user) return null;

  // Parse tag_id if it's a string (from API)
  // tag_id is now always an array of numbers
  const tagIds: number[] = Array.isArray(user.tag_id) ? user.tag_id : [];

  // Map tag IDs to tag names
  const tagNames = tagIds
    .map((id) => tags.find((t) => t.id === id)?.name)
    .filter(Boolean);

  console.log("user", user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl  max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="text-2xl">
                {user.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.fullName}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Job Title</h4>
              <p className="text-muted-foreground">
                {user.jobTitle || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Company</h4>
              <p className="text-muted-foreground">
                {user.company || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Timezone</h4>
              <p className="text-muted-foreground">
                {user.timezone || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Language</h4>
              <p className="text-muted-foreground">
                {user.language || "Not specified"}
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
              {user.headline || "Not specified"}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Phone</h4>
            <p className="text-muted-foreground">
              {user.phone || "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">
              Are you planning to open a squat practice?
            </h4>
            <p className="text-muted-foreground">
              {user.que1
                ? user.que1.charAt(0).toUpperCase() + user.que1.slice(1)
                : "Not specified"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Are you a supplier?</h4>
            <p className="text-muted-foreground">
              {user.que2
                ? user.que2.charAt(0).toUpperCase() + user.que2.slice(1)
                : "Not specified"}
            </p>
          </div>
          {/* <div>
            <h4 className="font-medium mb-2">Tags</h4>
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
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
