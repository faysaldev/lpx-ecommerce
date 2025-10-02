/* eslint-disable @typescript-eslint/no-explicit-any */
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
import ConditionBadgeComponent from "../Vendors/SingleVendorView/ConditionBadgeComponent";

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
      <CardContent className="space-y-3">
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

interface ProductCardProps {
  product: Product | any;
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
  // Extract product data with proper fallbacks
  const {
    _id,
    id,
    vendor,
    vendorName,
    stock,
    name,
    productName,
    condition = "",
    category = "",
    vendorId = "",
    price = 0,
    images = [],
    image,
  } = product;

  // Use the correct ID (support both _id and id)
  const productId = _id || id;

  // Use the correct product name
  const finalProductName = name || productName || "Unnamed Product";

  // Use the correct stock quantity
  const finalStockQuantity = stock;

  // Use the correct vendor name
  const finalVendorName =
    vendor?.storeName || vendorName || vendor || "Unknown Vendor";

  // Use the correct vendor ID
  const finalVendorId = vendor?._id || vendorId;

  // Handle images array and single image
  const productImages =
    Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getVendorLink = () => {
    if (finalVendorId) {
      return `/vendor/${finalVendorId}`;
    }
  };

  const getImageUrl = (imgPath: string) => {
    if (!imgPath) return "";

    // Handle different path formats
    const cleanPath = imgPath.replace(/\\/g, "/");

    // If it's already a full URL, return as is
    if (cleanPath.startsWith("http")) {
      return cleanPath;
    }

    // If it starts with /, it's already relative to base
    if (cleanPath.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_BASE_URL || ""}${cleanPath}`;
    }

    // Otherwise, prepend base URL
    return `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${cleanPath}`;
  };

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);

  // List View Layout
  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-lg transition-all duration-300",
          className
        )}
      >
        <Link href={`/product/${productId}`}>
          <div className="flex">
            {/* Image Section */}
            <div className="relative w-48 h-48 flex-shrink-0 bg-muted">
              {productImages[0] ? (
                <Image
                  src={getImageUrl(productImages[0])}
                  alt={finalProductName}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  sizes="192px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                    {finalProductName}
                  </h3>

                  <div className="flex items-center gap-1 mt-1">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    {getVendorLink() ? (
                      <Link
                        href={`/vendor/${finalVendorId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {finalVendorName}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {finalVendorName}
                      </span>
                    )}
                  </div>

                  <ConditionBadgeComponent condition={condition} />
                </div>

                <div className="text-right space-y-2.5">
                  <p className="text-sm pt-3 font-bold">AED {formattedPrice}</p>
                  {finalStockQuantity === 0 ? (
                    <p className="text-sm text-red-600">Out of Stock</p>
                  ) : (
                    <p className="text-sm text-amber-200">
                      Only {finalStockQuantity} left
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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

                {showQuickView && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      onQuickView?.(product);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}

                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    isWishlistItem
                      ? onRemoveFromWishlist?.(product)
                      : onAddToWishlist?.(product);
                  }}
                >
                  <Heart className="h-4 w-4" />
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
      <Link href={`/product/${productId}`}>
        <div
          className={cn("relative", viewMode === "compact" ? "h-48" : "h-64")}
        >
          <div className="absolute inset-0 bg-muted" />

          {productImages[0] ? (
            <Image
              src={getImageUrl(productImages[0])}
              alt={finalProductName}
              fill
              className={cn(
                "object-contain transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
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
                    {isWishlistItem
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
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
          <Link
            href={`/vendor/${finalVendorId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-muted-foreground hover:text-primary transition-colors h-5 block"
          >
            {finalVendorName}
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground h-5">{finalVendorName}</p>
        )}

        <ConditionBadgeComponent condition={condition} />

        <div className="mt-auto">
          <div className="flex items-center justify-between space-y-2 mb-3">
            <div>
              <p className="text-sm pt-3 font-bold">AED {formattedPrice}</p>
              <div className="h-4 mt-1">
                {finalStockQuantity === 0 ? (
                  <p className="text-xs text-red-600">Out of Stock</p>
                ) : (
                  <p className="text-xs text-amber-200">
                    Only {finalStockQuantity} left
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// // TODO: marging to master
// "use client";

// import {
//   Eye,
//   Heart,
//   Package,
//   Share2,
//   ShoppingCart,
//   Store,
//   Zap,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import {
//   ConditionBadge,
//   GradingBadge,
//   SealedBadge,
// } from "@/components/UI/badge.variants";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent } from "@/components/UI/card";
// import { Skeleton } from "@/components/UI/skeleton";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/UI/tooltip";
// import { designTokens } from "@/design-system/compat";
// import type { Product } from "@/lib/types";
// import { cn } from "@/lib/utils";

// export function ProductCardSkeleton({
//   viewMode = "grid",
// }: {
//   viewMode?: "grid" | "list" | "compact";
// }) {
//   if (viewMode === "list") {
//     return (
//       <Card className="overflow-hidden">
//         <div className="flex">
//           <Skeleton className="w-48 h-48" />
//           <div className="flex-1 p-4 space-y-3">
//             <Skeleton className="h-6 w-3/4" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-2/3" />
//             <div className="flex gap-2">
//               <Skeleton className="h-9 w-24" />
//               <Skeleton className="h-9 w-24" />
//               <Skeleton className="h-9 w-9" />
//               <Skeleton className="h-9 w-9" />
//             </div>
//           </div>
//         </div>
//       </Card>
//     );
//   }

//   return (
//     <Card className="overflow-hidden">
//       <Skeleton className="h-64" />
//       <CardContent size="sm" className="space-y-3">
//         <Skeleton className="h-4 w-20" />
//         <Skeleton className="h-5 w-full" />
//         <Skeleton className="h-5 w-3/4" />
//         <div className="flex justify-between items-center">
//           <Skeleton className="h-8 w-24" />
//           <div className="flex gap-1">
//             <Skeleton className="h-9 w-9" />
//             <Skeleton className="h-9 w-9" />
//             <Skeleton className="h-9 w-9" />
//             <Skeleton className="h-9 w-9" />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// const ProductCard = ({
//   product,
//   viewMode = "grid",
//   onQuickView,
//   onAddToCart,
//   onAddToWishlist,
//   onRemoveFromWishlist,
//   onBuyNow,
//   onShare,
//   className,
//   showQuickView = true,
//   isWishlistItem = false,
// }: any) => {
//   // Handle both product data structures (standard Product interface vs form schema)
//   console.log(product, "product in product card");
//   const _id = product._id;
//   const vendorName = product?.vendor;
//   const stockQuantity = product?.stock;
//   const productName = product?.name;
//   const condition = product.condition || "";
//   const category = product.category || "";
//   const vendorId = product.vendorId || "";
//   const grading = product.grading;
//   const price = product.price || 0;
//   const images = product.images || (product.image ? [product.image] : []); // Handle both images array and single image

//   // Use the extracted values
//   const finalProductName = productName;
//   const finalStockQuantity = stockQuantity;
//   const finalCondition = condition;

//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   const getVendorLink = () => {
//     if (vendorId) {
//       return `/vendor/${vendorId}`;
//     }
//     return null;
//   };

//   const getVendorName = () => {
//     return vendorName;
//   };

//   // List View Layout
//   if (viewMode === "list") {
//     return (
//       <Card
//         className={cn(
//           "overflow-hidden hover:shadow-lg transition-all duration-300",
//           className
//         )}
//       >
//         <Link href={`/product/${_id}`}>
//           <div className="flex">
//             {/* Image Section */}
//             <div className="relative w-48 h-48 flex-shrink-0 bg-muted">
//               {images?.[0] ? (
//                 <Image
//                   src={`${process.env.NEXT_PUBLIC_BASE_URL}/${images[0].replace(
//                     /\\/g,
//                     "/"
//                   )}`}
//                   alt={finalProductName}
//                   fill
//                   className={cn(
//                     "object-contain transition-opacity duration-300",
//                     imageLoaded ? "opacity-100" : "opacity-0"
//                   )}
//                   onLoad={() => setImageLoaded(true)}
//                 />
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Package className="h-12 w-12 text-muted-foreground/30" />
//                 </div>
//               )}
//             </div>

//             {/* Content Section */}
//             <div className="flex-1 p-4">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1 pr-4">
//                   <h3 className="typography-heading-xs hover:text-primary transition-colors line-clamp-1">
//                     {finalProductName}
//                   </h3>

//                   <div className="flex items-center gap-1 mt-1">
//                     <Store className="h-4 w-4 text-muted-foreground" />
//                     {getVendorLink() ? (
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.preventDefault();
//                           e.stopPropagation();
//                           const link = getVendorLink();
//                           if (link) window.location.href = link;
//                         }}
//                         className="typography-body-sm text-muted-foreground hover:text-primary transition-colors text-left"
//                       >
//                         {getVendorName()}
//                       </button>
//                     ) : (
//                       <span className="typography-body-sm text-muted-foreground">
//                         {getVendorName()}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex items-center gap-2 mt-3">
//                     {finalCondition === "sealed" && (
//                       <SealedBadge>
//                         <Package className="h-3 w-3 mr-1" />
//                         Sealed
//                       </SealedBadge>
//                     )}
//                     {finalCondition === "open" && grading && (
//                       <GradingBadge
//                         company={grading.company}
//                         grade={grading.grade}
//                       />
//                     )}
//                     {finalCondition === "open" &&
//                       !grading &&
//                       finalCondition && (
//                         <ConditionBadge condition={finalCondition} />
//                       )}
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <p className="text-xl font-bold">${price}</p>
//                   {finalStockQuantity === 0 ? (
//                     <p
//                       className={cn(
//                         "text-sm ",
//                         designTokens.colors.status.error
//                       )}
//                     >
//                       Out of Stock
//                     </p>
//                   ) : finalStockQuantity <= 5 ? (
//                     <p
//                       className={cn(
//                         "text-sm ",
//                         designTokens.colors.status.warning
//                       )}
//                     >
//                       Only {finalStockQuantity} left
//                     </p>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Action Buttons - Standard Order */}
//               <div className="flex items-center gap-2 mt-4">
//                 <Button
//                   size="sm"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     onAddToCart?.(product);
//                   }}
//                   disabled={finalStockQuantity === 0}
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" />
//                   Add to Cart
//                 </Button>

//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     onBuyNow?.(product);
//                   }}
//                   disabled={finalStockQuantity === 0}
//                 >
//                   <Zap className="h-4 w-4 mr-2" />
//                   Buy Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Link>
//       </Card>
//     );
//   }

//   // Grid/Compact View Layout
//   return (
//     <Card
//       className={cn(
//         "overflow-hidden hover:shadow-xl transition-all duration-300 group",
//         viewMode === "compact" && "h-[360px]",
//         className
//       )}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Link href={`/product/${_id}`}>
//         <div
//           className={cn("relative", viewMode === "compact" ? "h-48" : "h-64")}
//         >
//           <div className="absolute inset-0 bg-muted" />

//           {images?.[0] ? (
//             <Image
//               src={`${process.env.NEXT_PUBLIC_BASE_URL}/${images[0]}`}
//               alt={finalProductName}
//               fill
//               className={cn(
//                 "object-contain transition-opacity duration-300",
//                 imageLoaded ? "opacity-100" : "opacity-0"
//               )}
//               onLoad={() => setImageLoaded(true)}
//             />
//           ) : (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Package className="h-12 w-12 text-muted-foreground/30" />
//             </div>
//           )}

//           {/* Quick View Button */}
//           {showQuickView && (
//             <TooltipProvider>
//               <div
//                 className={cn(
//                   "absolute top-2 right-2 transition-opacity duration-300 flex flex-col gap-2",
//                   isHovered ? "opacity-100" : "opacity-0"
//                 )}
//               >
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="secondary"
//                       className="h-8 w-8"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         onQuickView?.(product);
//                       }}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Quick View</TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="secondary"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         isWishlistItem
//                           ? onRemoveFromWishlist?.(product)
//                           : onAddToWishlist?.(product);
//                       }}
//                       className="h-8 w-8"
//                     >
//                       <Heart className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {isWishlistItem
//                       ? "Remove from Wishlist"
//                       : "Add to Wishlist"}
//                   </TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="secondary"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         onShare?.(product);
//                       }}
//                       className="h-8 w-8"
//                     >
//                       <Share2 className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Share</TooltipContent>
//                 </Tooltip>
//               </div>
//             </TooltipProvider>
//           )}
//         </div>
//       </Link>

//       <CardContent
//         className={cn("p-4 flex flex-col", viewMode === "compact" && "p-3")}
//       >
//         <div className="flex items-start justify-between mb-2">
//           <p className="text-xs text-muted-foreground uppercase tracking-wide">
//             {category}
//           </p>
//         </div>

//         <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 h-12">
//           {finalProductName}
//         </h3>

//         {getVendorLink() ? (
//           <button
//             type="button"
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               const link = getVendorLink();
//               if (link) window.location.href = link;
//             }}
//             className="text-sm text-muted-foreground hover:text-primary transition-colors h-5 block text-left"
//           >
//             {getVendorName()}
//           </button>
//         ) : (
//           <p className="text-sm text-muted-foreground h-5">{getVendorName()}</p>
//         )}

//         <div className="flex gap-1 h-7 items-center my-2">
//           {finalCondition === "sealed" && (
//             <SealedBadge className="text-xs">
//               <Package className="h-3 w-3 mr-1" />
//               Sealed
//             </SealedBadge>
//           )}
//           {finalCondition === "open" && grading && (
//             <GradingBadge
//               company={grading.company}
//               grade={grading.grade}
//               className="text-xs"
//             />
//           )}
//           {finalCondition === "open" && !grading && finalCondition && (
//             <ConditionBadge condition={finalCondition} className="text-xs" />
//           )}
//         </div>

//         <div className="mt-auto">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <p className="text-xl font-bold">${price}</p>
//               <div className="h-4 mt-1">
//                 {finalStockQuantity === 0 ? (
//                   <p
//                     className={cn("text-xs", designTokens.colors.status.error)}
//                   >
//                     Out of Stock
//                   </p>
//                 ) : finalStockQuantity <= 5 ? (
//                   <p
//                     className={cn(
//                       "text-xs",
//                       designTokens.colors.status.warning
//                     )}
//                   >
//                     Only {finalStockQuantity} left
//                   </p>
//                 ) : (
//                   <span className="text-xs">&nbsp;</span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons - Full Width */}
//           <div className="grid grid-cols-2 gap-2">
//             <Button
//               size="sm"
//               onClick={(e) => {
//                 e.preventDefault();
//                 onAddToCart?.(product);
//               }}
//               disabled={finalStockQuantity === 0}
//               className="text-xs w-full"
//             >
//               <ShoppingCart className="h-4 w-4 mr-1" />
//               Add to Cart
//             </Button>

//             <Button
//               size="sm"
//               variant="outline"
//               onClick={(e) => {
//                 e.preventDefault();
//                 onBuyNow?.(product);
//               }}
//               disabled={finalStockQuantity === 0}
//               className="text-xs w-full"
//             >
//               <Zap className="h-4 w-4 mr-1" />
//               Buy Now
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;
