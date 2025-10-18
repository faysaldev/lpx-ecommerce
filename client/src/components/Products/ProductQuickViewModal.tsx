/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Loader2,
  Truck,
  Scale,
  Ruler,
  Tag,
  Package,
  Shield,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { useGetSingleProductQuickViewMutation } from "@/redux/features/products/product";
import VendorTruncateDetails from "../Vendors/SingleVendorView/VendorTruncateDetails";

interface Product {
  _id: string;
  productName: string;
  description: string;
  category: string;
  condition: string;
  rarity: string;
  price: number;
  optionalPrice?: number;
  stockQuantity: number;
  images: string[];
  discountPercentage: number;
  brand?: string;
  inStock: boolean;
  acceptOffers: boolean;
  vendor: {
    storeName: string;
    _id: string;
  };
  shipping: {
    shippingCost: number;
    weight: number;
    dimensions?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductViewModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Memoized condition and rarity color getters
const getConditionColor = (condition: string) => {
  const colors: { [key: string]: string } = {
    Mint: "bg-green-500/20 text-green-300 border-green-500/30",
    "Near Mint": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Excellent: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Very Good": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Good: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Fair: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Poor: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return colors[condition] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
};

const getRarityColor = (rarity: string) => {
  const colors: { [key: string]: string } = {
    Common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    Uncommon: "bg-green-500/20 text-green-300 border-green-500/30",
    Rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Super Rare": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "Ultra Rare": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "Secret Rare": "bg-red-500/20 text-red-300 border-red-500/30",
    Legendary: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Mythic: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  };
  return colors[rarity] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
};

const calculateDiscountPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100;
};

export default function ProductViewModal({
  productId,
  isOpen,
  onClose,
}: ProductViewModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [fetchQuickDetails, { isLoading }] =
    useGetSingleProductQuickViewMutation();

  // Fetch product data with useCallback
  const fetchDetails = useCallback(async () => {
    if (!isOpen || !productId) return;

    try {
      setError(null);
      const res: any = await fetchQuickDetails(productId);

      if (res?.data?.data?.attributes) {
        setProduct(res.data.data.attributes);
      } else {
        throw new Error("Failed to load product details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [isOpen, productId, fetchQuickDetails]);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setProduct(null);
    setError(null);
    setSelectedImage(0);
  }, []);

  // Close modal on escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Effects
  useEffect(() => {
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, fetchDetails]);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#252d3d36] backdrop-blur-sm">
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-xl">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Product Details
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-60px)]">
          {isLoading && (
            <div className="flex items-center justify-center p-8 sm:p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-blue-400 mx-auto mb-3" />
                <p className="text-sm sm:text-base text-gray-300 font-medium">
                  Loading product...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center p-8 sm:p-12">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-500/30">
                  <X className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
                </div>
                <p className="text-red-400 text-sm sm:text-base font-medium mb-3">
                  {error}
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="rounded-lg border-gray-600 text-white hover:bg-gray-800 text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
              {/* Image Gallery */}
              <div className="space-y-3 sm:space-y-4">
                {/* Main Image */}
                <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gray-800 border border-gray-700">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product.images[selectedImage]}`}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square overflow-hidden rounded-lg border transition-all duration-200 ${
                          selectedImage === index
                            ? "border-blue-500 ring-1 ring-blue-500"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${image}`}
                          alt={`${product.productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                      {product.productName}
                    </h1>

                    {product.brand && (
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                        <p className="text-sm sm:text-base text-gray-300">
                          {product.brand}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Badge className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {product.category}
                    </Badge>
                    <Badge
                      className={`px-2 py-1 text-xs font-medium border ${getConditionColor(
                        product.condition
                      )}`}
                    >
                      {product.condition}
                    </Badge>
                    <Badge
                      className={`px-2 py-1 text-xs font-medium border ${getRarityColor(
                        product.rarity
                      )}`}
                    >
                      {product.rarity}
                    </Badge>
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-2 p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      AED{" "}
                      {product.discountPercentage > 0
                        ? calculateDiscountPrice(
                            product.price,
                            product.discountPercentage
                          ).toFixed(2)
                        : product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-base text-gray-400 line-through">
                          AED {product.price.toFixed(2)}
                        </span>
                        <Badge className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-300 border-red-500/30">
                          {product.discountPercentage}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>
                  {product.optionalPrice && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        Optional: AED {product.optionalPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock & Offers */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product.inStock ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        product.inStock ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product.inStock
                        ? `In Stock (${product.stockQuantity})`
                        : "Out of Stock"}
                    </span>
                  </div>
                  {product.acceptOffers && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                      Offers Accepted
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    Description
                  </h3>
                  <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed text-sm">
                      <VendorTruncateDetails
                        description={product.description}
                        truncateLength={120}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
