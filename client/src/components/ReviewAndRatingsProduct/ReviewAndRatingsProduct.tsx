/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { CardTitle } from "@/components/UI/card";
import ReviewModal from "@/components/Ratings/GivingRatingModel";
import { ReviewCard } from "@/components/Ratings/ShowingRating";
import {
  useAddNewratingsMutation,
  useGetHasUserPurschedQuery,
  useGetProductsOrVendorRatingQuery,
} from "@/redux/features/Orders/Orders";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// Example usage in a product/vendor page
const ReviewAndRatingsProduct = ({ idtype }: any) => {
  const user = useSelector(selectCurrentUser);

  const { id, type } = idtype;
  const { data } = useGetHasUserPurschedQuery({ id, type });
  const hasUser = data?.data;

  const { data: Review, refetch } = useGetProductsOrVendorRatingQuery({
    id,
    type,
  });
  const ReviewData = Review?.data?.attributes;
  const [AddNewRatings] = useAddNewratingsMutation();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
    vendorId: string;
  }) => {
    const { vendorId, comment, rating } = review;
    const data = {
      ratingType: type,
      review: comment,
      referenceId: vendorId,
      rating: rating,
    };
    const res = await AddNewRatings(data).unwrap();
    if (res?.data?.code === 201) {
      refetch();
      setIsReviewModalOpen(false);
    }
  };

  // Format the review data from API
  const recentReviews =
    ReviewData?.map((review: any) => ({
      id: review._id,
      userName: review.author.name,
      rating: review.rating,
      comment: review.review,
      date: new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      verified: true, // You can adjust this based on your logic
      userImage: review.author.image,
    })) || [];

  return (
    <div className="space-y-6 md:mt-5 lg:mt-10">
      {/* Recent Reviews */}
      <div className="space-y-4">
        <div>
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            {hasUser === true ? (
              <Button onClick={() => setIsReviewModalOpen(true)}>
                Write a Review
              </Button>
            ) : null}
          </CardTitle>
        </div>
        {recentReviews.map((review: any) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>
      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        vendorName={user?.name || ""}
        vendorImage={user?.image || ""}
        vendorCategory={type}
        onReviewSubmit={handleReviewSubmit}
        vendorId={id}
      />
    </div>
  );
};

export default ReviewAndRatingsProduct;
