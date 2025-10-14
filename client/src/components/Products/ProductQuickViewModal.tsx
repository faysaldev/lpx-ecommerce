/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Truck, Scale, Ruler } from "lucide-react";
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
      } finally {
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
      Mint: "bg-green-100 text-green-800 border-green-200",
      "Near Mint": "bg-emerald-100 text-emerald-800 border-emerald-200",
      Excellent: "bg-blue-100 text-blue-800 border-blue-200",
      "Very Good": "bg-cyan-100 text-cyan-800 border-cyan-200",
      Good: "bg-amber-100 text-amber-800 border-amber-200",
      Fair: "bg-orange-100 text-orange-800 border-orange-200",
      Poor: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[condition] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      Common: "bg-gray-100 text-gray-800 border-gray-200",
      Uncommon: "bg-green-100 text-green-800 border-green-200",
      Rare: "bg-blue-100 text-blue-800 border-blue-200",
      "Super Rare": "bg-purple-100 text-purple-800 border-purple-200",
      "Ultra Rare": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Secret Rare": "bg-red-100 text-red-800 border-red-200",
      Legendary: "bg-orange-100 text-orange-800 border-orange-200",
      Mythic: "bg-pink-100 text-pink-800 border-pink-200",
    };
    return colors[rarity] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          {isLoading && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg text-muted-foreground font-medium">
                  Loading product details...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center p-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-10 w-10 text-red-600" />
                </div>
                <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
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
                            ? "border-primary ring-2 ring-primary ring-opacity-20"
                            : "border-gray-200 hover:border-gray-300"
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
              <div className="space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {product.productName}
                      </h1>

                      {product.brand && (
                        <p className="text-lg text-gray-600 font-medium">
                          Brand: {product.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1.5 text-sm font-medium"
                    >
                      {product.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1.5 text-sm font-medium border-2 ${getConditionColor(
                        product.condition
                      )}`}
                    >
                      {product.condition}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1.5 text-sm font-medium border-2 ${getRarityColor(
                        product.rarity
                      )}`}
                    >
                      {product.rarity}
                    </Badge>
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-gray-900">
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
                        <span className="text-xl text-gray-500 line-through">
                          AED {product.price.toFixed(2)}
                        </span>
                        <Badge
                          variant="destructive"
                          className="px-3 py-1 text-sm font-bold"
                        >
                          {product.discountPercentage}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>
                  {product.optionalPrice && (
                    <p className="text-sm text-gray-600 font-medium">
                      Optional Price: AED {product.optionalPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Stock & Offers */}
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        product.inStock ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        product.inStock ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {product.inStock
                        ? `In Stock (${product.stockQuantity} available)`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    <VendorTruncateDetails
                      description={product.description}
                      truncateLength={150}
                    />
                  </p>
                </div>

                {/* Shipping & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      Shipping Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-800">Weight:</span>
                        <span className="font-semibold flex items-center gap-1 text-gray-800">
                          <Scale className="h-4 w-4" />
                          {product.shipping.weight} kg
                        </span>
                      </div>
                      {product.shipping.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-gray-800">Dimensions:</span>
                          <span className="font-semibold flex items-center gap-1 text-gray-800">
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
