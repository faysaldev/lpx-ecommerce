/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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

  // Fetch product data
  useEffect(() => {
    const fetchDetails = async () => {
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
    };

    fetchDetails();
  }, [isOpen, productId, fetchQuickDetails]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProduct(null);
      setError(null);
      setSelectedImage(0);
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
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

  const calculateDiscountPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

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
    return (
      colors[condition] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
    );
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252D3D] backdrop-blur-sm">
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Product Details</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          {isLoading && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-lg text-gray-300 font-medium">
                  Loading product details...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <X className="h-10 w-10 text-red-400" />
                </div>
                <p className="text-red-400 text-lg font-medium mb-4">{error}</p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="rounded-lg border-gray-600 text-white hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Image Gallery */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-800 border border-gray-700">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product.images[selectedImage]}`}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                          selectedImage === index
                            ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-30"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${image}`}
                          alt={`${product.productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6 lg:space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                      {product.productName}
                    </h1>

                    {product.brand && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <p className="text-lg text-gray-300 font-medium">
                          {product.brand}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <Badge className="px-3 py-1.5 text-sm font-medium bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {product.category}
                    </Badge>
                    <Badge
                      className={`px-3 py-1.5 text-sm font-medium border ${getConditionColor(
                        product.condition
                      )}`}
                    >
                      {product.condition}
                    </Badge>
                    <Badge
                      className={`px-3 py-1.5 text-sm font-medium border ${getRarityColor(
                        product.rarity
                      )}`}
                    >
                      {product.rarity}
                    </Badge>
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-3 p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <span className="text-3xl lg:text-4xl font-bold text-white">
                      AED{" "}
                      {product.discountPercentage > 0
                        ? calculateDiscountPrice(
                            product.price,
                            product.discountPercentage
                          ).toFixed(2)
                        : product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xl text-gray-400 line-through">
                          AED {product.price.toFixed(2)}
                        </span>
                        <Badge className="px-3 py-1 text-sm font-bold bg-red-500/20 text-red-300 border-red-500/30">
                          {product.discountPercentage}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>
                  {product.optionalPrice && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-400 font-medium">
                        Optional Price: AED {product.optionalPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock & Offers */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        product.inStock ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        product.inStock ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product.inStock
                        ? `In Stock (${product.stockQuantity} available)`
                        : "Out of Stock"}
                    </span>
                  </div>
                  {product.acceptOffers && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      Offers Accepted
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    Description
                  </h3>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                    <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                      <VendorTruncateDetails
                        description={product.description}
                        truncateLength={150}
                      />
                    </p>
                  </div>
                </div>

                {/* Shipping & Details */}
                <div className="grid grid-cols-1  gap-6 p-6 bg-gray-800/30 rounded-2xl border border-gray-700">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-400" />
                      Shipping Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-300">Weight:</span>
                        <span className="font-semibold flex items-center gap-1 text-white">
                          <Scale className="h-4 w-4" />
                          {product.shipping.weight} kg
                        </span>
                      </div>
                      {product.shipping.dimensions && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-300">Dimensions:</span>
                          <span className="font-semibold flex items-center gap-1 text-white">
                            <Ruler className="h-4 w-4" />
                            {product.shipping.dimensions}
                          </span>
                        </div>
                      )}
                    </div>
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
