"use client";

import { useEffect, useRef, useState } from "react";
import { EmptyStates } from "@/components/shared/EmptyState";
import ProductCard, {
  ProductCardSkeleton,
} from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/UI/skeleton";
import type { Product } from "@/lib/types";
import type { ViewMode } from "@/lib/browse-utils";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  isLoading?: boolean;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onShare?: (product: Product) => void;
  className?: string;
}

// Main ProductGrid Component
export function ProductGrid({
  products,
  viewMode,
  isLoading = false,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  onShare,
  className,
}: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          displayCount < products.length
        ) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 20, products.length));
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [displayCount, products.length, isLoadingMore]);

  const gridClassName = cn(
    "w-full",
    {
      "grid gap-6 grid-cols-1": viewMode === "list",
      "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":
        viewMode === "grid",
    },
    className
  );

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton
            key={`${viewMode}-skeleton-${i}-${Date.now()}`}
            viewMode={viewMode}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyStates.NoProducts />;
  }

  return (
    <>
      <div className={gridClassName}>
        {products.slice(0, displayCount).map((product, index) => (
          <ProductCard
            key={product.id || `product-${index}`}
            product={product}
            viewMode={viewMode}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onBuyNow={onBuyNow}
            onShare={onShare}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {displayCount < products.length && (
        <div ref={observerRef} className="w-full py-8 flex justify-center">
          {isLoadingMore && (
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <span className="text-sm text-muted-foreground">
                Loading more products...
              </span>
            </div>
          )}
        </div>
      )}

      {/* Results summary */}
      {displayCount >= products.length && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Showing all {products.length} products
          </p>
        </div>
      )}
    </>
  );
}
