/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Heart, Minus, Package, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ConditionBadge,
  GradingBadge,
  RarityBadge,
  SealedBadge,
  StockBadge,
} from "@/components/UI/badge.variants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/UI/card";
import type { CartItem as CartItemType, Product } from "@/lib/types";

const cartItems = [
  {
    id: "1",
    productId: "101",
    name: "Awesome Product 1",
    price: 199.99,
    quantity: 2,
    image: "https://via.placeholder.com/150",
    vendor: "Vendor A",
    product: {
      id: "101",
      name: "Awesome Product 1",
      price: 199.99,
      compareAtPrice: 249.99,
      description: "An amazing product with high quality.",
      category: "Electronics",
      stock: 10,
    },
  },
];

// },
// {
//   id: "2",
//   productId: "102",
//   name: "Product B",
//   price: 99.99,
//   quantity: 1,
//   image: "https://via.placeholder.com/150",
//   vendor: "Vendor B",
//   product: {
//     id: "102",
//     name: "Product B",
//     price: 99.99,
//     compareAtPrice: 129.99,
//     description: "A reliable and affordable product.",
//     category: "Home Appliances",
//     stock: 5,
//   },
// },
// {
//   id: "3",
//   productId: "103",
//   name: "Product C",
//   price: 79.99,
//   quantity: 3,
//   image: "https://via.placeholder.com/150",
//   vendor: "Vendor C",
//   product: {
//     id: "103",
//     name: "Product C",
//     price: 79.99,
//     compareAtPrice: 109.99,
//     description: "An entry-level product with great value.",
//     category: "Furniture",
//     stock: 20,
//   },
// },
// {
//   id: "4",
//   productId: "104",
//   name: "Product D",
//   price: 149.99,
//   quantity: 1,
//   image: "https://via.placeholder.com/150",
//   vendor: "Vendor D",
//   product: {
//     id: "104",
//     name: "Product D",
//     price: 149.99,
//     compareAtPrice: 199.99,
//     description: "A premium product with excellent features.",
//     category: "Kitchen",
//     stock: 7,
//   },
// },

interface ExtendedProduct extends Omit<Product, "state"> {
  state?: "sealed" | "open"; // Making 'state' optional in ExtendedProduct
  grading?: {
    company: string;
    grade: string;
  };
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
  product: ExtendedProduct; // The product field is of type ExtendedProduct
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { product, quantity }: any = {
    id: "1",
    productId: "101",
    name: "Product A",
    price: 100,
    quantity: 2,
    image: "https://via.placeholder.com/150",
    vendor: "Vendor A",
    product: {
      id: 101,
      name: "Product A",
      price: 100,
      compareAtPrice: 120,
      description: "A high-quality product.",
      category: "Electronics",
      stock: 5,
      state: "sealed",
      grading: undefined, // No grading for this product
      condition: undefined, // No condition for this product
      rarity: "Rare",
      slug: "product-a", // Added missing field
      originalPrice: 150, // Added missing field
      image: "https://via.placeholder.com/150", // Added missing field
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ], // Added missing field
      tags: ["electronics", "high quality"], // Added missing field
      vendorId: "vendor-1", // Added missing field
      rating: 4.5, // Added missing field
      reviewCount: 10, // Added missing field
      createdAt: "2023-01-01T00:00:00Z", // Added missing field
      updatedAt: "2023-01-01T00:00:00Z", // Added missing field
      authenticity: {
        verified: true, // Added missing field
        certificate: "ABC123", // Added missing field
        verifiedBy: "Certifier", // Added missing field
        verificationDate: "2023-01-01", // Added missing field
      },
    },
  };

  console.log(product);

  // const

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    onUpdateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const subtotal = product.price * quantity;
  const savings = product.compareAtPrice
    ? (product.compareAtPrice - product.price) * quantity
    : 0;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
          <Link href={`/product/${product.id}`}>
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
              <Image
                src={product.images[0] || "/placeholder.png"}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.stock <= 5 && (
                <div className="absolute top-2 right-2">
                  <StockBadge stock={product.stock} className="text-xs" />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-2">
          {/* Title and Remove Button */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <Link
                href={`/product/${product.id}`}
                className="font-medium text-base sm:text-lg hover:text-primary transition line-clamp-2"
              >
                {product.title}
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Meta */}
          <div className="flex flex-wrap gap-2">
            {(product as ExtendedProduct).state === "sealed" && (
              <SealedBadge className="text-xs">
                <Package className="h-3 w-3 mr-1" />
                Sealed
              </SealedBadge>
            )}
            {(product as ExtendedProduct).state === "open" &&
              (product as ExtendedProduct).grading && (
                <GradingBadge
                  company={(product as ExtendedProduct).grading?.company || ""}
                  grade={(product as ExtendedProduct).grading?.grade || ""}
                  className="text-xs"
                />
              )}
            {(product as ExtendedProduct).state === "open" &&
              !(product as ExtendedProduct).grading &&
              product.condition && (
                <ConditionBadge
                  condition={product.condition}
                  className="text-xs"
                />
              )}
            {product.rarity && (
              <RarityBadge rarity={product.rarity} className="text-xs" />
            )}
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
                {savings > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${((product.compareAtPrice ?? 0) * quantity).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                ${product.price.toFixed(2)} each
              </p>
              {savings > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You save ${savings.toFixed(2)}
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!Number.isNaN(val) && val > 0) {
                      handleQuantityChange(val);
                    }
                  }}
                  className="w-12 text-center border-none outline-none focus:ring-0"
                  min="1"
                  max={product.stock}
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stock <= 10 && (
                <span className="text-xs text-muted-foreground">
                  ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" className="text-xs">
              <Heart className="h-3 w-3 mr-1" />
              Save for later
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              View similar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
