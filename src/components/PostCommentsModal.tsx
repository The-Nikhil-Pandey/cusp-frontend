import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Trash2,
  Send,
  Reply as ReplyIcon,
} from "lucide-react";
import {
  fetchCommentsByPostId,
  addComment,
  addReply,
  deleteComment,
  deleteReply,
} from "@/api/comment";
import { useAuth } from "@/contexts/AuthContext";

interface Reply {
  reply_user_id: string;
  reply_username: string;
  reply_text: string;
  reply_created_at: string;
}

interface Comment {
  id: number;
  user_id: string;
  post_id: string;
  comment_text: string;
  created_at: string;
  status: number;
  username: string;
  post_title: string;
  replies: Reply[];
}

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
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: number]: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [replyBoxOpen, setReplyBoxOpen] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [deleting, setDeleting] = useState<{ [key: string]: boolean }>({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchCommentsByPostId(post.id.toString())
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
          console.log("Fetched comments:", data);
        } else {
          setComments([]);
        }
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, post.id]);

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      await addComment(post.id.toString(), commentInput);
      setCommentInput("");
      const data = await fetchCommentsByPostId(post.id.toString());
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddReply = async (commentId: number) => {
    const replyText = replyInputs[commentId] || "";
    if (!replyText.trim()) return;
    setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
    try {
      await addReply(post.id.toString(), commentId.toString(), replyText);
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      const data = await fetchCommentsByPostId(post.id.toString());
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    setDeleting((prev) => ({ ...prev, [commentId]: true }));
    try {
      await deleteComment(commentId.toString());
      const data = await fetchCommentsByPostId(post.id.toString());
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setDeleting((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    setDeleting((prev) => ({ ...prev, [replyId]: true }));
    try {
      await deleteReply(replyId);
      const data = await fetchCommentsByPostId(post.id.toString());
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setDeleting((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  const toggleReplies = (id: number) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleReplyBox = (id: number) => {
    setReplyBoxOpen({ [id]: true }); // Only one reply box open at a time
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <DialogTitle className="sr-only">Post Comments</DialogTitle>
        <DialogDescription className="sr-only">
          View and add comments and replies for this post.
        </DialogDescription>
        <div className="flex flex-col md:flex-row">
          {/* Post Half */}
          <div
            className="md:w-1/2 w-full min-w-0 border-r border-border bg-background p-4 flex flex-col"
            style={{ maxWidth: "50%" }}
          >
            <PostCard post={post} />
          </div>
          {/* Comments Half */}
          <div className="md:w-1/2 w-full p-4 flex flex-col bg-muted/40">
            <div className="mb-4">
              <span className="font-semibold text-lg">Comments</span>
              <span className="ml-2 text-muted-foreground">
                ({comments.length})
              </span>
              <span className="ml-4 font-semibold">Likes:</span>
              <span className="ml-1 text-muted-foreground">{post.likes}</span>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {loading ? (
                <div>Loading...</div>
              ) : comments.length === 0 ? (
                <div className="text-muted-foreground">No comments yet.</div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-background rounded-lg p-3 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">
                        {comment.username}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {user?.fullName === comment.username && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deleting[comment.id]}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReplyBox(comment.id)}
                        className="flex items-center gap-1"
                      >
                        <ReplyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="ml-6 text-sm">{comment.comment_text}</div>
                    {/* Reply Box */}
                    {replyBoxOpen[comment.id] && (
                      <div className="ml-6 mt-2 flex gap-2 items-center">
                        <input
                          className="border rounded px-2 py-1 text-sm flex-1 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Write a reply..."
                          value={replyInputs[comment.id] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          disabled={replyLoading[comment.id]}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={replyLoading[comment.id]}
                        >
                          {replyLoading[comment.id] ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                    {/* Replies */}
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
                            {comment.replies.map((reply, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 mt-1"
                              >
                                <span className="text-xs text-muted-foreground">
                                  {reply.reply_username}:
                                </span>
                                <span className="text-xs">
                                  {reply.reply_text}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(
                                    reply.reply_created_at
                                  ).toLocaleString()}
                                </span>
                                {user?.fullName === reply.reply_username && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteReply(reply.reply_user_id)
                                    }
                                    disabled={deleting[reply.reply_user_id]}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
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
                ))
              )}
            </div>
            {/* Add Comment Box */}
            <div className="mt-4 flex gap-2 items-center">
              <input
                className="border rounded px-2 py-1 text-lg flex-1 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={commentLoading}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={commentLoading}
              >
                {commentLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentsModal;
