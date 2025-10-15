/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Eye, Heart, Package, ShoppingCart, Store, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"; // Import this for proper typing

import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import { Skeleton } from "@/components/UI/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import ConditionBadgeComponent from "../Vendors/SingleVendorView/ConditionBadgeComponent";
import { useAddTocartMutation } from "@/redux/features/BrowseCollectibles/BrowseCollectibles";
import { getImageUrl } from "@/lib/getImageURL";
import { useAddNewToWishListMutation } from "@/redux/features/GetWishList/GetWishList";
import { useBuyNowMutation } from "@/redux/features/BuyNowPyemant/BuyNowPyemant";
import ProductViewModal from "../Products/ProductQuickViewModal";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectHeaderStatitics } from "@/redux/features/Common/CommonSlice";

interface ErrorData {
  message: string;
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
    stockQuantity,
    name,
    productName,
    condition = "",
    category = "",
    vendorId = "",
    price = 0,
    images = [],
    image,
    optionalPrice,
  } = product;

  const [addtoCartProduct] = useAddTocartMutation();
  const [addtoWithlist] = useAddNewToWishListMutation();
  const [payment] = useBuyNowMutation();
  const headerStats = useAppSelector(selectHeaderStatitics);

  // Use the correct ID (support both _id and id)
  const productId = _id || id;
  // Check if product is already in wishlist
  const isInWishlist = headerStats?.wishlistProductIds?.includes(productId);

  // const [wishlistIconUpdate, setWishlistIconUpdate] = useState(isInWishlist);

  // console.log('show wishlist Icon', wishlistIconUpdate)


  const addToCart = async () => {
    await addtoCartProduct({
      product: productId,
      vendorId: vendorId ? vendorId : product?.vendorId,
      quantity: 1,
      price,
    });
    toast("Added to Cart");
  };

  // Use the correct product name
  const finalProductName = name || productName || "Unnamed Product";

  // Use the correct stock quantity
  const finalStockQuantity = stockQuantity;

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

  const addNewWishList = async () => {
    // Don't add if already in wishlist
    if (isInWishlist) {
      toast.info("Product is already in your wishlist");
      return;
    }

    const res = await addtoWithlist({
      products: product?._id,
      vendorId: product?.vendor?._id,
    });

    if (res?.error) {
      const error = res.error as FetchBaseQueryError;

      // Ensure the error data has a message
      const errorData = error.data as ErrorData | undefined;

      if (errorData && errorData.message) {
        toast.error(errorData.message);
      } else {
        toast.error("An error occurred while adding to the wishlist.");
      }
    } else {
      toast("Added to Wishlist");
    }
  };

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);

  const optionData = new Intl.NumberFormat("en-US").format(optionalPrice);

  const byNowHandler = async () => {
    console.log(product, "product");
    const data = [
      {
        productId: product?.id || product?._id,
        quantity: 1,
        price: product?.price,
        vendorId: product?.vendorId,
      },
    ];

    console.log(data, "format data");
    try {
      const res = await payment(data);
      if (res?.data?.code === 200) {
        window.location.href = res?.data?.data?.attributes?.payment_url || "/";
      }
    } catch (error) {
      console.log("error showld", error);
    }
  };

  // TODO: for opening the modal
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
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
        <Link href={`/product/${productId}`}>
          <div className="flex">
            {/* Image Section */}
            <div className="relative rounded-2xl w-48 h-48 flex-shrink-0 ">
              {productImages[0] ? (
                <Image
                  src={getImageUrl(productImages[0])}
                  alt={finalProductName}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-300",
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
                  <Link href={`/product/${productId}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1 cursor-pointer">
                      {finalProductName}
                    </h3>
                  </Link>

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
                  <h1 className="text-sm pt-3 font-bold">{optionData}</h1>

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
                  onClick={addToCart}
                  disabled={finalStockQuantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={byNowHandler}
                  disabled={finalStockQuantity === 0}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={addNewWishList}
                  disabled={isInWishlist}
                  className={cn(
                    isInWishlist && "bg-red-50 text-red-600 border-red-200"
                  )}
                >
                  <Heart
                    className={cn("h-4 w-4", isInWishlist && "fill-current")}
                  />
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
    <>
      <Card
        className={cn(
          "overflow-hidden hover:shadow-xl transition-all duration-300 group",
          viewMode === "compact" && "h-[360px]",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn("relative", viewMode === "compact" ? "h-48" : "h-64")}
        >
          <div className="absolute inset-0 bg-muted" />
          <Link href={`/product/${productId}`}>
            {productImages[0] ? (
              <Image
                src={getImageUrl(productImages[0])}
                alt={finalProductName}
                fill
                className={cn(
                  "object-cover w-full h-full  rounded-t-2xl transition-opacity duration-300",
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
          </Link>

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
                      onClick={() =>
                        handleProductClick(product?.id || product?._id)
                      }
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
                      onClick={addNewWishList}
                      disabled={isInWishlist}
                      className={cn(
                        "h-8 w-8 transition-all",
                        isInWishlist && "bg-red-50 text-red-600 border-red-200"
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-all",
                          isInWishlist && "fill-current text-red-600"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isInWishlist
                      ? "Already in Wishlist"
                      : isWishlistItem
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>

        <CardContent
          className={cn("p-4 flex flex-col", viewMode === "compact" && "p-3")}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {category}
            </p>
          </div>

          <Link href={`/product/${productId}`}>
            <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 h-12">
              {finalProductName}
            </h3>
          </Link>

          {getVendorLink() ? (
            <Link
              href={`/vendor/${finalVendorId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-muted-foreground hover:text-primary transition-colors h-5 block"
            >
              {finalVendorName}
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground h-5">
              {finalVendorName}
            </p>
          )}

          <ConditionBadgeComponent condition={condition} />
          <div className="mt-auto">
            <div className="flex items-center justify-between space-y-2 mb-3">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-md font-semibold">
                    AED {formattedPrice}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        {optionData}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
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
                onClick={addToCart}
                disabled={finalStockQuantity === 0}
                className="text-xs w-full"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={byNowHandler}
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

      <ProductViewModal
        productId={selectedProductId || ""}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductCard;

