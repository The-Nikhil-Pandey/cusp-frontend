import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Comment {
  id: number;
  user: string;
  text: string;
  replies?: Comment[];
}

const staticComments: Comment[] = [
  {
    id: 1,
    user: "Amit Sharma",
    text: "Great post! Very helpful.",
    replies: [
      { id: 11, user: "Priya Singh", text: "I agree!" },
      { id: 12, user: "Ravi Kumar", text: "Thanks for sharing." },
    ],
  },
  {
    id: 2,
    user: "Neha Verma",
    text: "Can you share more details?",
    replies: [{ id: 21, user: "Amit Sharma", text: "Sure, will DM you." }],
  },
  {
    id: 3,
    user: "Rohit Mehra",
    text: "Looking forward to more posts like this!",
  },
];

interface PostCommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: any;
}

const PostCommentsModal: React.FC<PostCommentsModalProps> = ({
  open,
  onOpenChange,
  post,
}) => {
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleReplies = (id: number) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* Post Half */}
          <div className="md:w-1/2 w-full border-r border-border bg-background p-4 flex flex-col">
            <PostCard post={post} />
          </div>
          {/* Comments Half */}
          <div className="md:w-1/2 w-full p-4 flex flex-col bg-muted/40">
            <div className="mb-4">
              <span className="font-semibold text-lg">Comments</span>
              <span className="ml-2 text-muted-foreground">
                ({post.comments})
              </span>
              <span className="ml-4 font-semibold">Likes:</span>
              <span className="ml-1 text-muted-foreground">{post.likes}</span>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {staticComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-background rounded-lg p-3 border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span className="font-medium">{comment.user}</span>
                  </div>
                  <div className="ml-6 text-sm">{comment.text}</div>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 mt-2">
                      {!expandedReplies[comment.id] ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-primary"
                          onClick={() => toggleReplies(comment.id)}
                        >
                          <ChevronDown className="inline h-4 w-4 mr-1" /> View
                          Replies ({comment.replies.length})
                        </Button>
                      ) : (
                        <>
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-center gap-2 mt-1"
                            >
                              <span className="text-xs text-muted-foreground">
                                {reply.user}:
                              </span>
                              <span className="text-xs">{reply.text}</span>
                            </div>
                          ))}
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-primary mt-1"
                            onClick={() => toggleReplies(comment.id)}
                          >
                            <ChevronUp className="inline h-4 w-4 mr-1" /> Hide
                            Replies
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentsModal;
