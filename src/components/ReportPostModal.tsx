import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { reportPost } from "@/api/report";

const reasons = [
  "Spam or misleading",
  "Hate speech or abuse",
  "Violence or threat",
  "Inappropriate content",
  "False information",
  "Other",
];

interface ReportPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

const ReportPostModal: React.FC<ReportPostModalProps> = ({
  open,
  onOpenChange,
  postId,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    try {
      const reason = selectedReason === "Other" ? otherReason : selectedReason;
      if (!reason) {
        toast({ title: "Please select a reason or enter your reason." });
        setLoading(false);
        return;
      }
      await reportPost(postId.toString(), reason);
      toast({
        title: "Reported successfully!",
        description: "Thank you for your feedback.",
      });
      onOpenChange(false);
      setSelectedReason("");
      setOtherReason("");
    } catch (e) {
      toast({
        title: "Failed to report post.",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm">Why are you reporting this post?</p>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <Button
                key={reason}
                variant={selectedReason === reason ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedReason(reason)}
              >
                {reason}
              </Button>
            ))}
          </div>
          {selectedReason === "Other" && (
            <input
              type="text"
              className="w-full border rounded px-2 py-1 mt-2"
              placeholder="Enter your reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}
        </div>
        <DialogFooter className="flex gap-2 mt-4">
          <Button className="flex-1" onClick={handleReport} disabled={loading}>
            {loading ? "Reporting..." : "Submit Report"}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPostModal;
