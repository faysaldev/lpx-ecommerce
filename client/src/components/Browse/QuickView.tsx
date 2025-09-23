"use client";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Package,
  Share2,
  Shield,
  ShoppingCart,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/UI/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import type { Product } from "@/lib/types";
import { CONDITIONS } from "@/lib/browse-utils";
import { cn } from "@/lib/utils";

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function QuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
}: QuickViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const condition = CONDITIONS.find((c) => c.value === product.condition);
  const images = product.images || [product.image];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-background p-6">
            <div className="relative aspect-square">
              {images[selectedImageIndex] ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.featured && (
                  <Badge className="bg-yellow-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.authenticity?.verified && (
                  <Badge className="bg-green-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {images.map((image, index) => (
                  <button
                    key={`thumbnail-${image || "placeholder"}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative w-16 h-16 border-2 rounded-md overflow-hidden transition-all",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  {product.category}
                </p>
                <DialogTitle className="text-2xl">{product.name}</DialogTitle>
              </div>
            </DialogHeader>

            {/* Price and Stock */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.stock > 0 && product.stock <= 5 && (
                  <Badge variant="destructive">Only {product.stock} left</Badge>
                )}
              </div>
              {product.stock === 0 && (
                <p className="text-red-500 mt-1">Out of Stock</p>
              )}
            </div>

            {/* Vendor Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{product.vendor}</span>
              </div>
            </div>

            {/* Condition */}
            {condition && (
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="gap-1">
                  <div
                    className={cn("w-2 h-2 rounded-full", condition.color)}
                  />
                  Condition: {condition.label}
                </Badge>
              </div>
            )}

            <Separator className="my-4" />

            {/* Description Tabs */}
            <Tabs defaultValue="description" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>

              <div className="h-32 overflow-y-auto">
                <TabsContent value="description" className="mt-4 h-full">
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </TabsContent>

                <TabsContent value="details" className="mt-4 h-full">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">SKU:</dt>
                      <dd>{product.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd>{product.category}</dd>
                    </div>
                    {product.condition && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Condition:</dt>
                        <dd>{condition?.label}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Stock:</dt>
                      <dd>
                        {product.stock > 0
                          ? `${product.stock} available`
                          : "Out of stock"}
                      </dd>
                    </div>
                  </dl>
                </TabsContent>

                <TabsContent value="shipping" className="mt-4 h-full">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Free shipping on orders over $100</li>
                    <li>• Standard shipping: 5-7 business days</li>
                    <li>• Express shipping: 2-3 business days</li>
                    <li>• International shipping available</li>
                  </ul>
                </TabsContent>
              </div>
            </Tabs>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons - Order: Add > Buy > Like > Share */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    onAddToCart?.(product);
                    onClose();
                  }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    // TODO: Implement buy now functionality
                    if (process.env.NODE_ENV !== "production")
                      console.log("Buy now clicked for:", product.id);
                    onClose();
                  }}
                  disabled={product.stock === 0}
                >
                  <Zap className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    onAddToWishlist?.(product);
                  }}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isWishlisted && "fill-red-500 text-red-500"
                    )}
                  />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    // TODO: Implement share functionality
                    if (process.env.NODE_ENV !== "production")
                      console.log("Share clicked for:", product.id);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* View Full Details Link */}
              <Button variant="ghost" className="w-full" asChild>
                <Link href={`/product/${product.id}`}>
                  View Full Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
