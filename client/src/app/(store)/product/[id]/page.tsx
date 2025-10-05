"use client";

import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import {
  ConditionBadge,
  GradingBadge,
  SealedBadge,
  StockBadge,
} from "@/components/UI/badge.variants";
import { Button } from "@/components/UI/button";
import { designTokens } from "@/design-system/compat";
// import { getProductAPI } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      const resolvedParams = await params;

      try {
        // const api = getProductAPI();
        // const response = await api.getProductById(resolvedParams.id);
        // if (response.success) {
        //   setProduct(response.data);
        // }
      } catch (error) {
        if (process.env.NODE_ENV !== "production")
          console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params]);

  if (loading) {
    return (
      <PageLayout title="Loading..." showHeader={true} showFooter={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout title="Product Not Found" showHeader={true} showFooter={true}>
        <div className="text-center py-12">
          <h1 className={cn(designTokens.typography.h3, "mb-4")}>
            Product Not Found
          </h1>
          <p className={cn(designTokens.typography.bodySmall, "mb-6")}>
            The product you{`'`}re looking for doesn{`'`}t exist or has been
            removed.
          </p>
          <Link href="/browse" className="text-primary hover:underline">
            Back to Browse
          </Link>
        </div>
      </PageLayout>
    );
  }

  const getCategorySlug = () => {
    if (product.categorySlug) {
      return product.categorySlug;
    }

    if (typeof product.category === "string") {
      return product.category.toLowerCase().replace(/\s+/g, "-");
    }

    return "unknown";
  };

  const breadcrumbs = [
    { label: "Browse", href: "/browse" },
    {
      label: product.category,
      href: `/category/${getCategorySlug()}`,
    },
    { label: product.name },
  ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      showHeader={true}
      showFooter={true}
      withCard={true}
    >
      <div className="flex min-h-[600px] overflow-hidden rounded-lg border">
        {/* Left Half - Product Images */}
        <div className="flex-1 flex flex-col bg-muted/30 border-r">
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-lg aspect-square relative">
              <Image
                src={
                  (product.images
                    ? product.images[selectedImage]
                    : product.image) || "/placeholder-card.jpg"
                }
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="p-6 border-t">
            <div className="flex space-x-3 justify-center">
              {(product.images || [product.image])
                .filter(Boolean)
                .map((image, index: number) => (
                  <button
                    type="button"
                    key={`image-${image}`}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all relative",
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary ring-opacity-20"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={image || "/placeholder-card.jpg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Half - Product Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className={cn(designTokens.typography.h3, "mb-2")}>
                  {product.name}
                </h1>

                {/* Seller Info */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Sold by{" "}
                    {product.vendorId ? (
                      <Link
                        href={`/vendor/${product.vendorId}`}
                        className="font-medium text-foreground hover:text-primary transition-colors underline decoration-dotted hover:decoration-solid"
                      >
                        {product.vendor}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {product.vendor}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-${product.id}-${i}`}
                          className={cn(
                            "h-3 w-3",
                            i < 4.8
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span>(Verified Seller)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-muted-foreground">
                    SKU: {product.id.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className={cn(designTokens.typography.h2)}>
                    ${product.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.stock > 5
                    ? "In Stock"
                    : product.stock > 0
                    ? `Only ${product.stock} left in stock`
                    : "Out of Stock"}
                </p>
              </div>

              {/* Product Badges */}
              <div className="flex flex-wrap gap-2">
                {product.stock <= 5 && product.stock > 0 && (
                  <StockBadge stock={product.stock} />
                )}
                {product.state === "sealed" && <SealedBadge />}
                {product.state === "open" && product.grading && (
                  <GradingBadge
                    company={product.grading.company}
                    grade={product.grading.grade}
                  />
                )}
                {product.state === "open" &&
                  !product.grading &&
                  product.condition && (
                    <ConditionBadge condition={product.condition} />
                  )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[50px]">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Standard button order: Cart → Buy → Wishlist → Share */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="min-w-[140px]">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline" className="min-w-[120px]">
                    <Zap className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Description */}
              <div className="border-t pt-6">
                <h3 className={cn(designTokens.typography.h4, "mb-3")}>
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.specifications &&
                  Object.keys(product.specifications).length > 0 && (
                    <div>
                      <h3 className={cn(designTokens.typography.h4, "mb-3")}>
                        Specifications
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                            >
                              <span className="font-medium">{key}:</span>
                              <span className="text-muted-foreground">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
