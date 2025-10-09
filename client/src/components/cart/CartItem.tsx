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
                <span className="text-2xl font-bold text-primary">
                  ${itemTotal.toFixed(2)}
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
            <Button variant="ghost" size="sm" className="text-xs h-8">
              <Heart className="h-3 w-3 mr-1" />
              Save for later
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-8">
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Heart, Minus, Package, Plus, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import {
//   ConditionBadge,
//   GradingBadge,
//   RarityBadge,
//   SealedBadge,
// } from "@/components/UI/badge.variants";
// import { Button } from "@/components/UI/button";
// import { Card } from "@/components/UI/card";
// import type { CartItem as CartItemType, Product } from "@/lib/types";

// interface ExtendedProduct extends Omit<Product, "state"> {
//   state?: "sealed" | "open";
//   grading?: {
//     company: string;
//     grade: string;
//   };
// }

// const getImageUrl = (imgPath: string) => {
//   if (!imgPath) return "";

//   // Handle different path formats
//   const cleanPath = imgPath.replace(/\\/g, "/");

//   // If it's already a full URL, return as is
//   if (cleanPath.startsWith("http")) {
//     return cleanPath;
//   }

//   // If it starts with /, it's already relative to base
//   if (cleanPath.startsWith("/")) {
//     return `${process.env.NEXT_PUBLIC_BASE_URL || ""}${cleanPath}`;
//   }

//   // Otherwise, prepend base URL
//   return `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${cleanPath}`;
// };

// interface CartItemProps {
//   item: CartItemType;
//   onUpdateQuantity: (
//     itemId: string,
//     quantity: number,
//     calculatedTotalPrice: number
//   ) => void;
//   onRemove: (itemId: string) => void;
// }

// const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
//   const [isUpdating, setIsUpdating] = useState(false);
//   // Local state to track quantity for immediate UI update
//   const [localQuantity, setLocalQuantity] = useState(item.quantity);

//   // Use the nested product object if it exists, otherwise use item properties
//   // Since the API response may have additional properties not in the base CartItem interface
//   const productData = (item as any).product || {
//     id: item.productId,
//     title: item.name,
//     price: (item as any).money || item.price,
//     images: [
//       (item as any).firstImage
//         ? (item as any).firstImage.startsWith("public/")
//           ? `/${(item as any).firstImage.replace("public/", "")}`
//           : (item as any).firstImage
//         : (item.image
//             ? item.image.startsWith("public/")
//               ? `/${item.image.replace("public/", "")}`
//               : item.image
//             : undefined) || "/placeholder.png",
//     ],
//     stock: (item as any).stockQuantity,
//     condition: (item as any).condition,
//     rarity: (item as any).rarity,
//     totalPrice: (item as any).totalPrice,
//     cartId: (item as any).cartId,
//   };

//   const actualPrice = (item as any).money || item.price || 0;
//   const actualQuantity = localQuantity;
//   const productName = (item as any).productName;
//   const productStock = (item as any).stockQuantity;
//   const cartId = (item as any).cartId;

//   // Calculate total price: actualPrice × actualQuantity
//   const calculatedTotalPrice = actualPrice * actualQuantity;
//   // console.log(calculatedTotalPrice, "calculated total price");
//   // Sync local quantity with item.quantity when it changes from parent
//   useEffect(() => {
//     setLocalQuantity(item.quantity);
//   }, [item.quantity]);

//   // console.log(productStock, "stock of the product");

//   const handleQuantityChange = async (newQuantity: number) => {
//     // Validate quantity: minimum 1, maximum productStock
//     const validQuantity = Math.max(1, Math.min(newQuantity, productStock));

//     // Update local state immediately for instant UI feedback
//     setLocalQuantity(validQuantity);
//     setIsUpdating(true);

//     // Call parent function to update cart in backend
//     onUpdateQuantity(item.productId, validQuantity, calculatedTotalPrice);

//     setTimeout(() => setIsUpdating(false), 300);
//   };

//   // console.log(item, "immage of the products");

//   return (
//     <Card className="p-4 sm:p-6">
//       <div className="flex flex-col sm:flex-row gap-4">
//         {/* Product Image */}
//         <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
//           <Link href={`/product/${item.productId}`}>
//             <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition">
//               <Image
//                 src={
//                   getImageUrl((item as any)?.firstImage) || "/placeholder.png"
//                 }
//                 alt={productName || "Product image"}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </Link>
//           <div className="pl-2 mt-6 font-semibold text-sm">
//             In Stock ({productStock})
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="flex-1 space-y-2">
//           {/* Title and Remove Button */}
//           <div className="flex justify-between items-start gap-2">
//             <div className="flex-1">
//               <Link
//                 href={`/product/${item.productId}`}
//                 className="font-medium text-base sm:text-lg hover:text-primary transition line-clamp-2"
//               >
//                 {productName}
//               </Link>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => onRemove(cartId)}
//               className="h-8 w-8"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Product Meta */}
//           <div className="flex flex-wrap gap-2">
//             {(productData as ExtendedProduct).state === "sealed" && (
//               <SealedBadge className="text-xs">
//                 <Package className="h-3 w-3 mr-1" />
//                 Sealed
//               </SealedBadge>
//             )}
//             {(productData as ExtendedProduct).state === "open" &&
//               (productData as ExtendedProduct).grading && (
//                 <GradingBadge
//                   company={
//                     (productData as ExtendedProduct).grading?.company || ""
//                   }
//                   grade={(productData as ExtendedProduct).grading?.grade || ""}
//                   className="text-xs"
//                 />
//               )}
//             {(productData as ExtendedProduct).state === "open" &&
//               !(productData as ExtendedProduct).grading &&
//               (item as any).condition && (
//                 <ConditionBadge
//                   condition={(item as any).condition}
//                   className="text-xs"
//                 />
//               )}
//             {(item as any).rarity && (
//               <RarityBadge rarity={(item as any).rarity} className="text-xs" />
//             )}
//           </div>

//           {/* Price and Quantity Controls */}
//           <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
//             {/* Price Section */}
//             <div className="space-y-1">
//               <div className="flex items-baseline gap-2">
//                 <span className="text-lg font-semibold">
//                   ${Number(actualPrice || 0).toFixed(2)}
//                 </span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 ${Number(calculatedTotalPrice).toFixed(2)} each ×{" "}
//                 {actualQuantity}
//               </p>
//             </div>

//             {/* Quantity Controls */}
//             <div className="flex items-center gap-2">
//               <div className="flex items-center border rounded-lg">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={() => handleQuantityChange(actualQuantity - 1)}
//                   disabled={actualQuantity <= 1 || isUpdating}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </Button>

//                 <input
//                   type="number"
//                   value={actualQuantity}
//                   onChange={(e) => {
//                     const val = parseInt(e.target.value, 10);
//                     if (!Number.isNaN(val) && val > 0) {
//                       handleQuantityChange(val);
//                     }
//                   }}
//                   className="w-12 text-center border-none outline-none focus:ring-0"
//                   min="1"
//                   max={productStock}
//                   disabled={isUpdating}
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={() => handleQuantityChange(actualQuantity + 1)}
//                   disabled={actualQuantity >= productStock || isUpdating}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>
//               {productStock <= 10 && (
//                 <span className="text-xs text-muted-foreground">
//                   ({productStock} available)
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 pt-2">
//             <Button variant="ghost" size="sm" className="text-xs">
//               <Heart className="h-3 w-3 mr-1" />
//               Save for later
//             </Button>
//             <Button variant="ghost" size="sm" className="text-xs">
//               <Package className="h-3 w-3 mr-1" />
//               View similar
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default CartItem;
