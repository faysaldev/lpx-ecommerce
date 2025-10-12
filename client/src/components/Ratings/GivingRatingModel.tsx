"use client";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/dialog";
import { Textarea } from "@/components/UI/textarea";
import { Label } from "@/components/UI/label";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Badge } from "@/components/UI/badge";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  vendorImage?: string;
  vendorCategory?: string;
  onReviewSubmit: (review: {
    rating: number;
    comment: string;
    vendorId: string;
  }) => Promise<void>;
  vendorId: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  vendorName,
  vendorImage,
  vendorCategory,
  onReviewSubmit,
  vendorId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write a review with at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReviewSubmit({
        rating,
        comment: comment.trim(),
        vendorId,
      });

      toast.success("Review submitted successfully!");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setHoverRating(0);
    onClose();
  };

  const displayRating = hoverRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Write a Review
          </DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <div className="space-y-6">
          {/* Vendor Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={vendorImage} alt={vendorName} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg truncate">
                      {vendorName}
                    </h3>
                    {vendorCategory && (
                      <Badge variant="secondary" className="text-xs">
                        {vendorCategory}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <div className="space-y-3">
            <Label htmlFor="rating" className="text-base font-medium">
              Overall Rating *
            </Label>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= displayRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-lg font-semibold text-muted-foreground ml-2">
                {displayRating}.0
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {displayRating === 0 && "Select a rating from 1 to 5 stars"}
              {displayRating === 1 && "Poor - Very dissatisfied"}
              {displayRating === 2 && "Fair - Somewhat dissatisfied"}
              {displayRating === 3 && "Good - Satisfied"}
              {displayRating === 4 && "Very Good - Happy with the experience"}
              {displayRating === 5 && "Excellent - Extremely satisfied"}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-base font-medium">
              Your Review *
            </Label>
            <Textarea
              id="comment"
              placeholder="Share details of your experience with this vendor. What did you like or dislike? Would you recommend them to others?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span
                className={
                  comment.length < 10 || comment.length > 500
                    ? "text-destructive"
                    : ""
                }
              >
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting || rating === 0 || comment.trim().length < 10
              }
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
