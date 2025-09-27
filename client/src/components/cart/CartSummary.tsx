"use client";

import {
  ArrowRight,
  Info,
  Lock,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
// import { useAuth } from "@/context/AuthContext";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount: number;
  itemCount: number;
  couponCode?: string | null;
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  discount,
  itemCount,
  couponCode,
}: CartSummaryProps) {
  const router = useRouter();
  // const { isSignedIn } = useAuth();

  const FREE_SHIPPING_THRESHOLD = 100;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );
  const discountAmount = subtotal * discount;

  const handleCheckout = () => {
    // if (isSignedIn) {
    //   router.push("/checkout");
    // } else {
    //   router.push("/sign-in?redirect_url=/checkout");
    // }
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>${subtotal.toFixed(2)}</span>
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
            <span className="text-green-600">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span
              className={shipping === 0 ? "text-green-600 font-medium" : ""}
            >
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {/* Free Shipping Progress */}
          {remainingForFreeShipping > 0 && shipping > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    Add ${remainingForFreeShipping.toFixed(2)} more for free
                    shipping!
                  </p>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {shipping === 0 && (
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-900 dark:text-green-100">
                  You qualify for free shipping!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Estimated tax</span>
            <Info className="h-3 w-3 text-muted-foreground" />
          </div>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl">${total.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          className="w-full"
          size="lg"
          disabled={itemCount === 0}
        >
          <Lock className="h-4 w-4 mr-2" />
          Proceed to Checkout
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        {/* Trust Badges */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure checkout powered by Stripe</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            <span>30-day returns on all items</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Accepted payment methods
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Visa
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Mastercard
            </Badge>
            <Badge variant="secondary" className="text-xs">
              PayPal
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Apple Pay
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
