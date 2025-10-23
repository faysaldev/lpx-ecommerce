/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Minus, Package, Plus, X } from "lucide-react";
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
    const validQuantity = Math.max(1, Math.min(newQuantity, stockQuantity));
    setQuantity(validQuantity);
    setIsUpdating(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onUpdateQuantity(productId, validQuantity, stockQuantity);
      setIsUpdating(false);
    }, 500);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(1);
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      handleQuantityChange(parsed);
    }
  };

  // Handle input blur
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

  return (
    <div className="grid grid-cols-12 gap-4 py-4 px-6 border-b border-gray-100">
      {/* Product Image & Info */}
      <div className="col-span-12 md:col-span-6 flex items-start gap-4">
        {/* Product Image */}
        <Link href={`/product/${productId}`} className="flex-shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
            <Image
              src={firstImage}
              alt={productName || "Product"}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <Link
              href={`/product/${productId}`}
              className="font-semibold text-gray-50 hover:text-primary transition line-clamp-2 pr-4"
            >
              {productName}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(cartId, productId)}
              className="h-8 w-8 flex-shrink-0 opacity-60 hover:opacity-100"
              title="Remove item"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {state === "sealed" && (
              <SealedBadge className="text-xs py-0.5">
                <Package className="h-3 w-3 mr-1" />
                Sealed
              </SealedBadge>
            )}
            {state === "open" && grading && (
              <GradingBadge
                company={grading.company || ""}
                grade={grading.grade || ""}
                className="text-xs py-0.5"
              />
            )}
            {state === "open" && !grading && condition && (
              <ConditionBadge
                condition={condition}
                className="text-xs py-0.5"
              />
            )}
            {rarity && (
              <RarityBadge rarity={rarity} className="text-xs py-0.5" />
            )}
          </div>

          {/* Stock Warning */}
          {stockQuantity <= 10 && (
            <div className="mt-2">
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Only {stockQuantity} left
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Unit Price */}
      <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center">
        <div className="text-right md:text-center">
          <span className="font-semibold text-gray-50">
            AED {actualPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="col-span-4 md:col-span-2 flex items-center justify-start md:justify-center">
        <div className="flex items-center border border-gray-700 rounded-lg bg-gray-600">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-lg rounded-r-none hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            title="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-12 text-center border-none outline-none focus:ring-0 bg-transparent font-medium text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
            max={stockQuantity}
            disabled={isUpdating}
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-lg rounded-l-none hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stockQuantity || isUpdating}
            title={
              quantity >= stockQuantity
                ? "Maximum stock reached"
                : "Increase quantity"
            }
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Total Price */}
      <div className="col-span-4 md:col-span-2 flex items-center justify-end">
        <div className="text-right">
          <span className="font-bold text-gray-50 text-lg">
            AED {itemTotal.toFixed(2)}
          </span>
          {quantity >= stockQuantity && (
            <div className="text-xs text-orange-600 font-medium mt-1">
              Max quantity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
