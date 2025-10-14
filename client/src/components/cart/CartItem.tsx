/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Heart, Minus, Package, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ConditionBadge,
  GradingBadge,
  RarityBadge,
  SealedBadge,
} from "@/components/UI/badge.variants";
import { Button } from "@/components/UI/button";
import { Card } from "@/components/UI/card";
import { getImageUrl } from "@/lib/getImageURL";
import { useRouter } from "next/navigation";
import { useAddNewToWishListMutation } from "@/redux/features/GetWishList/GetWishList";

interface CartItemProps {
  item: any;
  localQuantity: number;
  onUpdateQuantity: (
    productId: string,
    quantity: number,
    stockQuantity: number
  ) => void;
  onRemove: (cartId: string, productId: string) => void;
}

const CartItem = ({
  item,
  localQuantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [quantity, setQuantity] = useState(localQuantity);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [addtoWithlist] = useAddNewToWishListMutation();

  // Extract item data
  const productId = item.productId;
  const cartId = item.cartId || item.id;
  const productName = item.productName || item.name;
  const actualPrice = item.money || item.price || 0;
  const stockQuantity = item.stockQuantity || 0;
  const firstImage = item.firstImage || item.image;
  const condition = item.condition;
  const rarity = item.rarity;
  const state = item.state;
  const grading = item.grading;

  // Calculate total price
  const itemTotal = actualPrice * quantity;

  // Sync with parent's local quantity
  useEffect(() => {
    setQuantity(localQuantity);
  }, [localQuantity]);

  // Debounced update handler
  const handleQuantityChange = (newQuantity: number) => {
    // Validate: minimum 1, maximum stock
    const validQuantity = Math.max(1, Math.min(newQuantity, stockQuantity));

    // Update local state immediately
    setQuantity(validQuantity);
    setIsUpdating(true);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API call (500ms delay)
    debounceTimerRef.current = setTimeout(() => {
      onUpdateQuantity(productId, validQuantity, stockQuantity);
      setIsUpdating(false);
    }, 500);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for better UX
    if (value === "") {
      setQuantity(1);
      return;
    }

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      handleQuantityChange(parsed);
    }
  };

  // Handle input blur - ensure valid value
  const handleInputBlur = () => {
    if (quantity < 1) {
      handleQuantityChange(1);
    } else if (quantity > stockQuantity) {
      handleQuantityChange(stockQuantity);
    }
  };

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const addNewWishList = async () => {
    await addtoWithlist({
      products: item?.productId,
      vendorId: item?.vendorId,
    });
    router.push("/wishlist");
  };

  return (
    <Card className="p-4 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 flex-shrink-0">
          <Link href={`/product/${productId}`}>
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
              <Image
                src={getImageUrl(firstImage)}
                alt={productName || "Product"}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          {stockQuantity <= 10 && (
            <div className="mt-2 text-center">
              <span className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded">
                Only {stockQuantity} left
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          {/* Title and Remove Button */}
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/product/${productId}`}
              className="font-medium text-base sm:text-lg hover:text-primary transition line-clamp-2 flex-1"
            >
              {productName}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(cartId, productId)}
              className="h-8 w-8 flex-shrink-0"
              title="Remove item"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Badges */}
          <div className="flex flex-wrap gap-2">
            {state === "sealed" && (
              <SealedBadge className="text-xs">
                <Package className="h-3 w-3 mr-1" />
                Sealed
              </SealedBadge>
            )}
            {state === "open" && grading && (
              <GradingBadge
                company={grading.company || ""}
                grade={grading.grade || ""}
                className="text-xs"
              />
            )}
            {state === "open" && !grading && condition && (
              <ConditionBadge condition={condition} className="text-xs" />
            )}
            {rarity && <RarityBadge rarity={rarity} className="text-xs" />}
          </div>

          {/* Price and Quantity Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
            {/* Price Display */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">
                  AED {itemTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                ${actualPrice.toFixed(2)} × {quantity}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-input rounded-lg bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-l-lg rounded-r-none hover:bg-muted"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                  title="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-14 text-center border-none outline-none focus:ring-0 bg-transparent font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  max={stockQuantity}
                  disabled={isUpdating}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-r-lg rounded-l-none hover:bg-muted"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= stockQuantity || isUpdating}
                  title={
                    quantity >= stockQuantity
                      ? "Maximum stock reached"
                      : "Increase quantity"
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {quantity >= stockQuantity && (
            <div className="bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 px-3 py-2 rounded-lg text-xs font-medium">
              Maximum available quantity reached
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              onClick={addNewWishList}
              variant="ghost"
              size="sm"
              className="text-xs h-8"
            >
              <Heart className="h-3 w-3 mr-1" />
              Save for later
            </Button>
            <Button
              onClick={() => router.push(`/category/${item?.category}`)}
              variant="ghost"
              size="sm"
              className="text-xs h-8"
            >
              <Package className="h-3 w-3 mr-1" />
              View similar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
