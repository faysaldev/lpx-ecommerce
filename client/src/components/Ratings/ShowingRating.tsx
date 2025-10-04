import { Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/UI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Card, CardContent } from "@/components/UI/card";

interface RatingDisplayProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function RatingDisplay({
  rating,
  size = "md",
  showNumber = false,
  className = "",
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
        ))}
        {hasHalfStar && (
          <StarHalf
            className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-gray-300`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Component to display a single review
interface ReviewCardProps {
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export function ReviewCard({
  userName,
  userImage,
  rating,
  comment,
  date,
  verified = false,
}: ReviewCardProps) {

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={
                userImage
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${userImage}`
                  : ''
              }
              alt={userName}
            />
            <AvatarFallback className="bg-primary/10">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold text-sm">{userName}</span>
              {verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>

            <RatingDisplay rating={rating} size="sm" showNumber />

            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {comment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
