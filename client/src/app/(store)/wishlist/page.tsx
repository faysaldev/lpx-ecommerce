"use client";

import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/UI/button";
// import { useWishlist } from "@/context/WishlistContext";
import { designTokens } from "@/design-system/compat";
import { cn } from "@/lib/utils";
// import type { Product } from "@/lib/types";
import { useState } from "react";
import { useGetUserWishlistQuery } from "@/redux/features/wishList/wishlist";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  categorySlug: string;
  vendor: string;
  vendorId: string;
  condition: "new" | "mint" | "excellent" | "good" | "fair" | "poor";
  rarity?: "common" | "uncommon" | "rare" | "very-rare" | "legendary";
  stock: number;
  sold: number;
  views: number;
  likes: number;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

function WishlistContent() {
  // const { items, clearWishlist, removeFromWishlist } = useWishlist();
  const [items, setItems] = useState<Product[]>([
    {
      id: "1",
      name: "Product A",
      slug: "product-a",
      description: "A high-quality product.",
      price: 100,
      originalPrice: 120,
      images: ["https://via.placeholder.com/150"],
      category: "Electronics",
      categorySlug: "electronics",
      vendor: "Vendor A",
      vendorId: "vendor-a",
      condition: "new",
      rarity: "common",
      stock: 10,
      sold: 2,
      views: 100,
      likes: 50,
      tags: ["new", "electronics"],
      featured: true,
      createdAt: new Date().toISOString(), // Convert to ISO string
      updatedAt: new Date().toISOString(), // Convert to ISO string
    },
    {
      id: "2",
      name: "Product B",
      slug: "product-b",
      description: "Affordable product.",
      price: 50,
      originalPrice: 60,
      images: ["https://via.placeholder.com/150"],
      category: "Home Appliances",
      categorySlug: "home-appliances",
      vendor: "Vendor B",
      vendorId: "vendor-b",
      condition: "mint",
      rarity: "uncommon",
      stock: 20,
      sold: 5,
      views: 200,
      likes: 75,
      tags: ["home", "affordable"],
      featured: false,
      createdAt: new Date().toISOString(), // Convert to ISO string
      updatedAt: new Date().toISOString(), // Convert to ISO string
    },
  ]);
  const { data: wishListQuery } = useGetUserWishlistQuery({});

  console.log(wishListQuery, "all the wishlist");

  const breadcrumbs = [{ label: "Wishlist" }];

  if (items.length === 0) {
    return (
      <PageLayout
        title="My Wishlist"
        description="Save your favorite items for later"
        breadcrumbs={breadcrumbs}
      >
        <EmptyStates.NoWishlistItems />
      </PageLayout>
    );
  }

  // Transform wishlist items to match Product type for ProductCard
  const products = items.map((item: Product) => ({
    ...item,
    image: item.images?.[0] || "",
    categorySlug:
      typeof item.category === "object"
        ? item.category || "uncategorized"
        : item.category || "uncategorized",
    vendor:
      typeof item.vendor === "object"
        ? item.vendor || "Unknown Vendor"
        : item.vendor || "Unknown Vendor",
    vendorId:
      typeof item.vendor === "object" ? item.vendor || "unknown" : "unknown",
    name: item.name || "Untitled",
    category:
      typeof item.category === "object"
        ? item.category || "Uncategorized"
        : item.category || "Uncategorized",
    originalPrice: item.originalPrice || 0,
    state: "open" as const,
    rating: 0,
    reviewCount: 0,
    isActive: true,
    tags: item.tags || [],
    year: new Date().getFullYear(),
    manufacturer: "Unknown",
  }));

  return (
    <PageLayout
      title="My Wishlist"
      description={`You have ${items.length} ${
        items.length === 1 ? "item" : "items"
      } saved`}
      breadcrumbs={breadcrumbs}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn(designTokens.typography.h3)}>
          {items.length} Saved {items.length === 1 ? "Item" : "Items"}
        </h2>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            // onClick={clearWishlist}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div
        className={cn(
          "grid gap-6",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="grid"
            onAddToCart={(p) => {
              if (process.env.NODE_ENV !== "production")
                console.log("Add to cart:", p);
            }}
            // onAddToWishlist={(p) => removeFromWishlist(p.id)}
            onBuyNow={(p) => {
              if (process.env.NODE_ENV !== "production")
                console.log("Buy now:", p);
            }}
            onShare={(p) => {
              if (process.env.NODE_ENV !== "production")
                console.log("Share:", p);
            }}
          />
        ))}
      </div>

      {/* Continue Shopping */}
      {items.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className={cn(designTokens.typography.h4, "mb-4")}>
              Looking for more?
            </h3>
            <p className="text-muted-foreground mb-6">
              Discover more unique collectibles from our verified vendors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/browse">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Collection
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/vendors">
                  Explore Vendors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default function WishlistPage() {
  return <WishlistContent />;
}
