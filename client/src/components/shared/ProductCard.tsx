"use client";

import {
  Eye,
  Heart,
  Package,
  Share2,
  ShoppingCart,
  Store,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ConditionBadge,
  GradingBadge,
  SealedBadge,
} from "@/components/UI/badge.variants";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Skeleton } from "@/components/UI/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import { designTokens } from "@/design-system/compat";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const _ACTION_ORDER = ["cart", "buy", "wishlist", "share"] as const;

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list" | "compact";
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onRemoveFromWishlist?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onShare?: (product: Product) => void;
  className?: string;
  showQuickView?: boolean;
  isWishlistItem?: boolean;
}

export function ProductCardSkeleton({
  viewMode = "grid",
}: {
  viewMode?: "grid" | "list" | "compact";
}) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <Skeleton className="w-48 h-48" />
          <div className="flex-1 p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64" />
      <CardContent size="sm" className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-1">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const ProductCard = ({
  product,
  viewMode = "grid",
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onBuyNow,
  onShare,
  className,
  showQuickView = true,
  isWishlistItem = false,
}: ProductCardProps) => {


  // Handle both product data structures (standard Product interface vs wishlist data)
  const _id = product._id || product.id;
  const vendorName = product.vendorName || product.vendor;
  const stockQuantity = product.stockQuantity !== undefined ? product.stockQuantity : product.stock;
  const productName = product.productName || product.name;
  const { price, images, condition, category, vendorId, grading } = product;
  
  // Use the extracted values
  const finalProductName = productName;
  const finalStockQuantity = stockQuantity;

  console.log(product)

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getVendorLink = () => {
    if (vendorId) {
      return `/vendor/${vendorId}`;
    }
    return null;
  };

  const getVendorName = () => {
    return vendorName;
  };

  // Helper function to validate image URL
  const isValidImageUrl = (url: string): boolean => {
    try {
      // Check if URL is empty or just whitespace
      if (!url || typeof url !== 'string' || !url.trim()) {
        return false;
      }
      
      // Check if it's a valid URL format (either absolute or relative)
      // Also accept data URLs and blob URLs
      const absoluteUrlRegex = /^(https?:\/\/|data:image|blob:)/i;
      const relativeUrlRegex = /^\/[^/]/; // Relative paths like /images/...
      
      return absoluteUrlRegex.test(url) || relativeUrlRegex.test(url);
    } catch (error) {
      return false;
    }
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-lg transition-all duration-300",
          className
        )}
      >
        <Link href={`/product/${_id}`}>
          <div className="flex">
            {/* Image Section */}
            <div className="relative w-48 h-48 flex-shrink-0 bg-muted">
              {images?.[0] && isValidImageUrl(images?.[0]) && (
                <Image
                  src={images?.[0]}
                  alt={finalProductName}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="typography-heading-xs hover:text-primary transition-colors line-clamp-1">
                    {finalProductName}
                  </h3>

                  <div className="flex items-center gap-1 mt-1">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    {getVendorLink() ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const link = getVendorLink();
                          if (link) window.location.href = link;
                        }}
                        className="typography-body-sm text-muted-foreground hover:text-primary transition-colors text-left"
                      >
                        {getVendorName()}
                      </button>
                    ) : (
                      <span className="typography-body-sm text-muted-foreground">
                        {getVendorName()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {condition === "sealed" && (
                      <SealedBadge>
                        <Package className="h-3 w-3 mr-1" />
                        Sealed
                      </SealedBadge>
                    )}
                    {condition === "open" && grading && (
                      <GradingBadge
                        company={grading.company}
                        grade={grading.grade}
                      />
                    )}
                    {condition === "open" && !grading && condition && (
                      <ConditionBadge condition={condition} />
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    {formatPrice(price)}
                  </p>
                  {finalStockQuantity === 0 ? (
                    <p
                      className={cn(
                        "text-sm mt-1",
                        designTokens.colors.status.error
                      )}
                    >
                      Out of Stock
                    </p>
                  ) : finalStockQuantity <= 5 ? (
                    <p
                      className={cn(
                        "text-sm mt-1",
                        designTokens.colors.status.warning
                      )}
                    >
                      Only {finalStockQuantity} left
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Action Buttons - Standard Order */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart?.(product);
                  }}
                  disabled={finalStockQuantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    onBuyNow?.(product);
                  }}
                  disabled={finalStockQuantity === 0}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Grid/Compact View Layout
  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-xl transition-all duration-300 group",
        viewMode === "compact" && "h-[360px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${_id}`}>
        <div
          className={cn("relative", viewMode === "compact" ? "h-48" : "h-64")}
        >
          <div className="absolute inset-0 bg-muted" />
          {images?.[0] && isValidImageUrl(images?.[0]) && (
            <Image
              src={images?.[0]}
              alt={finalProductName}
              fill
              className={cn(
                "object-contain transition-all duration-300 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Quick View Button */}
          {showQuickView && (
            <TooltipProvider>
              <div
                className={cn(
                  "absolute top-2 right-2 transition-opacity duration-300 flex flex-col gap-2",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        onQuickView?.(product);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Quick View</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        isWishlistItem
                          ? onRemoveFromWishlist?.(product)
                          : onAddToWishlist?.(product);
                      }}
                      className="h-8 w-8"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isWishlistItem ? "Remove from Wishlist" : "Add to Wishlist"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        onShare?.(product);
                      }}
                      className="h-8 w-8"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>
      </Link>

      <CardContent
        className={cn("p-4 flex flex-col", viewMode === "compact" && "p-3")}
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </p>
        </div>

        <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 h-12">
          {finalProductName}
        </h3>

        {getVendorLink() ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const link = getVendorLink();
              if (link) window.location.href = link;
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors h-5 block text-left"
          >
            {getVendorName()}
          </button>
        ) : (
          <p className="text-sm text-muted-foreground h-5">{getVendorName()}</p>
        )}

        <div className="flex gap-1 h-7 items-center my-2">
          {condition === "sealed" && (
            <SealedBadge className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              Sealed
            </SealedBadge>
          )}
          {condition === "open" && grading && (
            <GradingBadge
              company={grading.company}
              grade={grading.grade}
              className="text-xs"
            />
          )}
          {condition === "open" && !grading && condition && (
            <ConditionBadge condition={condition} className="text-xs" />
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xl font-bold">{formatPrice(price)}</p>
              <div className="h-4 mt-1">
                {finalStockQuantity === 0 ? (
                  <p
                    className={cn("text-xs", designTokens.colors.status.error)}
                  >
                    Out of Stock
                  </p>
                ) : finalStockQuantity <= 5 ? (
                  <p
                    className={cn(
                      "text-xs",
                      designTokens.colors.status.warning
                    )}
                  >
                    Only {finalStockQuantity} left
                  </p>
                ) : (
                  <span className="text-xs">&nbsp;</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product);
              }}
              disabled={finalStockQuantity === 0}
              className="text-xs w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                onBuyNow?.(product);
              }}
              disabled={finalStockQuantity === 0}
              className="text-xs w-full"
            >
              <Zap className="h-4 w-4 mr-1" />
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
