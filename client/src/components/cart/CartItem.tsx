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
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import type { CartItem as CartItemType, Product } from "@/lib/types";




interface ExtendedProduct extends Omit<Product, "state"> {
  state?: "sealed" | "open";
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


const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) =>  {
  const [isUpdating, setIsUpdating] = useState(false);

  // Use the nested product object if it exists, otherwise use item properties
  // Since the API response may have additional properties not in the base CartItem interface
  const productData = (item as any).product || {
    id: item.productId,
    title: item.name,
    price: (item as any).money || item.price,
    images: [
      (item as any).firstImage 
        ? (item as any).firstImage.startsWith('public/') 
          ? `/${(item as any).firstImage.replace('public/', '')}` 
          : (item as any).firstImage
        : (item.image 
          ? item.image.startsWith('public/') 
            ? `/${item.image.replace('public/', '')}` 
            : item.image
          : undefined) || "/placeholder.png"
    ],
    stock: (item as any).stockQuantity,
    condition: (item as any).condition,
    rarity: (item as any).rarity,
    totalPrice: (item as any).totalPrice,
  };

  const actualPrice = (item as any).money;
  const actualQuantity = item.quantity;
  const availableImageRaw = (item as any).firstImage ;
  const productName = (item as any).productName ;
  const productStock = (item as any).stockQuantity ; 
  const totalPrice = (item as any).totalPrice;

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    onUpdateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  
  

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
          <Link href={`/product/${item.productId}`}>
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
              {/* <Image
                src={availableImage || "/placeholder.png"}
                alt={productName || 'Product image'}
                fill
                className="object-cover"
              /> */}
              {productStock <= 5 && (
                <div className="absolute top-2 right-2">
                  <StockBadge stock={productStock} className="text-xs" />
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
                href={`/product/${item.productId}`}
                className="font-medium text-base sm:text-lg hover:text-primary transition line-clamp-2"
              >
                {productName}
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
            {(productData as ExtendedProduct).state === "sealed" && (
              <SealedBadge className="text-xs">
                <Package className="h-3 w-3 mr-1" />
                Sealed
              </SealedBadge>
            )}
            {(productData as ExtendedProduct).state === "open" &&
              (productData as ExtendedProduct).grading && (
                <GradingBadge
                  company={(productData as ExtendedProduct).grading?.company || ""}
                  grade={(productData as ExtendedProduct).grading?.grade || ""}
                  className="text-xs"
                />
              )}
            {(productData as ExtendedProduct).state === "open" &&
              !(productData as ExtendedProduct).grading &&
              (item as any).condition && (
                <ConditionBadge
                  condition={(item as any).condition}
                  className="text-xs"
                />
              )}
            {(item as any).rarity && (
              <RarityBadge rarity={(item as any).rarity} className="text-xs" />
            )}
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
            {/* Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold">
                  ${totalPrice.toFixed(2)}
                </span>
                {/* {savings > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${((productData.compareAtPrice ?? 0) * actualQuantity).toFixed(2)}
                  </span>
                )} */}
              </div>
              <p className="text-sm text-muted-foreground">
                ${actualPrice.toFixed(2)} each
              </p>
              
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(actualQuantity - 1)}
                  disabled={actualQuantity <= 1 || isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <input
                  type="number"
                  value={actualQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!Number.isNaN(val) && val > 0) {
                      handleQuantityChange(val);
                    }
                  }}
                  className="w-12 text-center border-none outline-none focus:ring-0"
                  min="1"
                  max={productStock}
                  disabled={isUpdating}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(actualQuantity + 1)}
                  disabled={actualQuantity >= productStock || isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {productStock <= 10 && (
                <span className="text-xs text-muted-foreground">
                  ({productStock} available)
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

export default CartItem;
