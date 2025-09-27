"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import ReviewModal from "@/components/Ratings/GivingRatingModel";
import { RatingDisplay, ReviewCard } from "@/components/Ratings/ShowingRating";
import PageLayout from "@/components/layout/PageLayout";

// Example usage in a product/vendor page
export default function VendorReviewSection() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
    vendorId: string;
  }) => {
    // Your API call to submit the review
    console.log("Submitting review:", review);
    // await submitReview(review);
  };

  // Mock data
  const vendorData = {
    id: "vendor-123",
    name: "Collectible Treasures",
    image: "/vendor-image.jpg",
    category: "Trading Cards",
    averageRating: 4.5,
    totalReviews: 24,
  };

  const recentReviews = [
    {
      id: 1,
      userName: "John Doe",
      rating: 5,
      comment:
        "Excellent service! The cards were in perfect condition and shipped quickly.",
      date: "2 days ago",
      verified: true,
    },
    {
      id: 2,
      userName: "Sarah Smith",
      rating: 4,
      comment:
        "Good quality items, but shipping took a bit longer than expected.",
      date: "1 week ago",
      verified: true,
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Reviews</span>
              <Button onClick={() => setIsReviewModalOpen(true)}>
                Write a Review
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {vendorData.averageRating.toFixed(1)}
                </div>
                <RatingDisplay rating={vendorData.averageRating} size="lg" />
                <div className="text-sm text-muted-foreground mt-1">
                  {vendorData.totalReviews} reviews
                </div>
              </div>

              <div className="flex-1">
                {/* Rating distribution could go here */}
                <div className="text-sm text-muted-foreground">
                  Based on customer experiences with {vendorData.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Reviews</h3>
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          vendorName={vendorData.name}
          vendorImage={vendorData.image}
          vendorCategory={vendorData.category}
          onReviewSubmit={handleReviewSubmit}
          vendorId={vendorData.id}
        />
      </div>
    </PageLayout>
  );
}
