"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorName: string;
}

export function ReviewModal({
  open,
  onOpenChange,
  mentorName,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle>Share your thoughts</DialogTitle>
                  <DialogDescription>
                    How was your session with{" "}
                    <span className="font-bold text-primary">{mentorName}</span>
                    ?
                  </DialogDescription>
                </div>
                <button
                  className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                  onClick={handleClose}
                >
                  close
                </button>
              </div>
            </DialogHeader>

            <div className="my-6">
              <Label className="block mb-stack-sm">Rating</Label>
              <div className="flex gap-stack-md">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={cn(
                      "material-symbols-outlined text-4xl cursor-pointer hover:scale-110 transition-all",
                      star <= rating
                        ? "text-tertiary-container"
                        : "text-outline-variant"
                    )}
                    style={{
                      fontVariationSettings: `'FILL' ${star <= rating ? 1 : 0}`,
                    }}
                    onClick={() => setRating(star)}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            <div className="my-6">
              <Label className="block mb-stack-sm">Your Experience</Label>
              <textarea
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-body-md font-body-md placeholder:text-outline transition-all resize-none p-stack-sm"
                placeholder="Tell the community what made this exchange special..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-stack-md mt-6">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmit}
              >
                Post Review
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-stack-lg">
              <span
                className="material-symbols-outlined text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <h2 className="text-display-lg-mobile font-headline-md text-on-surface mb-stack-sm">
              Thank you, truly.
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-stack-lg px-stack-md">
              Your words help keep the SkillSwap spirit alive. We&apos;ve sent
              your feedback to the mentor.
            </p>
            <Button variant="secondary" onClick={handleClose} className="mx-auto">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
