/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowRight,
  Info,
  Lock,
  Shield,
  ShoppingBag,
  Truck,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount: number;
  itemCount: number;
  couponCode?: string | null;
  items: any[];
}

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  discount,
  itemCount,
  couponCode,
  items,
}: CartSummaryProps) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);

  // Calculate free shipping progress
  const shippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return {
        qualified: true,
        remaining: 0,
        percentage: 100,
      };
    }

    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    const percentage = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;

    return {
      qualified: false,
      remaining: Math.max(0, remaining),
      percentage: Math.min(100, percentage),
    };
  }, [subtotal]);

  const discountAmount = subtotal * discount;

  const handleCheckout = () => {
    if (user) {
      router.push("/checkout");
    } else {
      router.push("/sign-in?redirect_url=/checkout");
    }
  };

  return (
    <Card className="sticky top-20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Order Summary</span>
          <Badge variant="secondary" className="text-xs">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">AED {subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Discount</span>
              {couponCode && (
                <Badge variant="secondary" className="text-xs">
                  {couponCode}
                </Badge>
              )}
            </div>
            <span className="text-green-600 font-medium">
              -AED {discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Shipping Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span
              className={
                shippingProgress.qualified
                  ? "text-green-600 font-semibold"
                  : "font-medium"
              }
            >
              {shippingProgress.qualified
                ? "FREE"
                : `AED ${shipping.toFixed(2)}`}
            </span>
          </div>

          {/* Free Shipping Status */}
          {/* {shippingProgress.qualified ? (
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-900 dark:text-green-100 font-medium">
                  You qualify for free shipping!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    Add{" "}
                    <span className="font-bold">
                      ${shippingProgress.remaining.toFixed(2)}
                    </span>{" "}
                    more for free shipping
                  </p>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${shippingProgress.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Tax */}
        {tax > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Estimated tax</span>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="font-medium">AED {tax.toFixed(2)}</span>
          </div>
        )}

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
          <span className="font-semibold text-lg">Total</span>
          <div className="text-right">
            <div className="font-bold text-2xl text-primary">
              AED {total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={itemCount === 0}
        >
          <Lock className="h-4 w-4 mr-2" />
          Proceed to Checkout
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        {/* Trust Badges */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs">Secure checkout powered by Stripe</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4 text-blue-600" />
            <span className="text-xs">30-day returns on all items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-purple-600" />
            <span className="text-xs">Fast delivery in 3-5 business days</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Accepted payment methods
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Visa
            </Badge>
            <Badge variant="outline" className="text-xs">
              Mastercard
            </Badge>
            <Badge variant="outline" className="text-xs">
              PayPal
            </Badge>
            <Badge variant="outline" className="text-xs">
              Apple Pay
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   ArrowRight,
//   Info,
//   Lock,
//   Shield,
//   ShoppingBag,
//   Truck,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Badge } from "@/components/UI/badge";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
// import { Separator } from "@/components/UI/separator";
// import { useAppSelector } from "@/redux/hooks";
// import { selectCurrentUser } from "@/redux/features/auth/authSlice";
// // import { useAuth } from "@/context/AuthContext";

// interface CartSummaryProps {
//   subtotal: number;
//   shipping: number;
//   tax: number;
//   total: number;
//   discount: number;
//   itemCount: number;
//   couponCode?: string | null;
//   items: any;
// }

// export default function CartSummary({
//   subtotal,
//   shipping,
//   tax,
//   total,
//   discount,
//   itemCount,
//   couponCode,
//   items,
// }: CartSummaryProps) {
//   const router = useRouter();
//   const user = useAppSelector(selectCurrentUser);

//   console.log("Cart items:", total);

//   const FREE_SHIPPING_THRESHOLD = 100;
//   const remainingForFreeShipping = Math.max(
//     0,
//     FREE_SHIPPING_THRESHOLD - subtotal
//   );
//   const discountAmount = subtotal * discount;

//   const handleCheckout = () => {
//     if (user) {
//       router.push("/checkout");
//     } else {
//       router.push("/sign-in?redirect_url=/checkout");
//     }
//   };

//   return (
//     <Card className="sticky top-20">
//       <CardHeader>
//         <CardTitle>Order Summary</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Item Count */}
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-muted-foreground">Items ({itemCount})</span>
//           <span>${Number(subtotal || 0).toFixed(2)}</span>
//         </div>

//         {/* Discount */}
//         {discount > 0 && (
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-2">
//               <span className="text-muted-foreground">Discount</span>
//               {couponCode && (
//                 <Badge variant="secondary" className="text-xs">
//                   {couponCode}
//                 </Badge>
//               )}
//             </div>
//             <span className="text-green-600">
//               -${Number(discountAmount || 0).toFixed(2)}
//             </span>
//           </div>
//         )}

//         {/* Shipping */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">Shipping</span>
//             <span
//               className={shipping === 0 ? "text-green-600 font-medium" : ""}
//             >
//               {shipping === 0 ? "FREE" : `${Number(shipping || 0).toFixed(2)}`}
//             </span>
//           </div>

//           {shipping === 0 && (
//             <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <Truck className="h-4 w-4 text-green-600" />
//                 <p className="text-xs text-green-900 dark:text-green-100">
//                   You qualify for free shipping!
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tax */}
//         {tax > 0 && (
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-1">
//               <span className="text-muted-foreground">Estimated tax</span>
//               <Info className="h-3 w-3 text-muted-foreground" />
//             </div>
//             <span>${Number(tax || 0).toFixed(2)}</span>
//           </div>
//         )}

//         <Separator />

//         {/* Total */}
//         <div className="flex items-center justify-between">
//           <span className="font-semibold text-lg">Total</span>
//           <span className="font-bold text-xl">
//             ${Number(total || 0).toFixed(2)}
//           </span>
//         </div>

//         {/* Checkout Button */}
//         <Button
//           onClick={handleCheckout}
//           className="w-full"
//           size="lg"
//           disabled={itemCount === 0}
//         >
//           <Lock className="h-4 w-4 mr-2" />
//           Proceed to Checkout
//           <ArrowRight className="h-4 w-4 ml-2" />
//         </Button>

//         {/* Trust Badges */}
//         <div className="space-y-3 pt-4">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Shield className="h-4 w-4" />
//             <span>Secure checkout powered by Stripe</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <ShoppingBag className="h-4 w-4" />
//             <span>30-day returns on all items</span>
//           </div>
//         </div>

//         {/* Payment Methods */}
//         <div className="pt-4 border-t">
//           <p className="text-xs text-muted-foreground mb-2">
//             Accepted payment methods
//           </p>
//           <div className="flex gap-2">
//             <Badge variant="secondary" className="text-xs">
//               Visa
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               Mastercard
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               PayPal
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               Apple Pay
//             </Badge>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// {
//   /* Free Shipping Progress */
// }
// {
//   /* {remainingForFreeShipping > 0 && shipping > 0 && (
//             <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <Truck className="h-4 w-4 text-blue-600 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="text-xs text-blue-900 dark:text-blue-100">
//                     Add ${Number(remainingForFreeShipping || 0).toFixed(2)} more
//                     for free shipping!
//                   </p>
//                   <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 mt-2">
//                     <div
//                       className="bg-blue-600 h-1.5 rounded-full transition-all"
//                       style={{
//                         width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )} */
// }
