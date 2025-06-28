
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="text-2xl">{user.fullName?.charAt(0)}</AvatarFallback>
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
              <p className="text-muted-foreground">{user.jobTitle || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Company</h4>
              <p className="text-muted-foreground">{user.company || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Timezone</h4>
              <p className="text-muted-foreground">{user.timezone || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Social Care Work</h4>
            <div className="flex flex-wrap gap-2">
              {user.socialCareWork?.map((work) => (
                <Badge key={work} variant="secondary">{work}</Badge>
              )) || <p className="text-muted-foreground">Not specified</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
