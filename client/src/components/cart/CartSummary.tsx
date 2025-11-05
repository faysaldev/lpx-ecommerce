/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowRight,
  Info,
  Lock,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
import { useBuyNowMutation } from "@/redux/features/BuyNowPyemant/BuyNowPyemant";
import { formatNumber } from "@/lib/utils/helpers";
import { toast } from "sonner";

type CheckoutErrorMessage = {
  message: string;
};

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount: number;
  itemCount: number;
  couponCode?: string | null;
  items: any[];
  localCartItems: Map<
    string,
    { quantity: number; price: number; stockQuantity: number }
  >;
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  discount,
  itemCount,
  couponCode,
  items,
  localCartItems,
}: CartSummaryProps) {
  const [payment] = useBuyNowMutation();
  const discountAmount = subtotal * discount;

  const handleCheckout = async () => {
    // Create array of objects with productId, vendorId, and updated quantity
    const checkoutData = items.map((item) => {
      const localItem = localCartItems.get(item.productId);
      return {
        productId: item.productId,
        vendorId: item.vendorId || item.sellerId || null, // Adjust based on your data structure
        quantity: localItem ? localItem.quantity : item.quantity,
      };
    });

    try {
      const res = await payment(checkoutData);

      // Check if the response has the expected success data structure
      if (res?.data?.code === 200) {
        window.location.href = res?.data?.data?.attributes?.payment_url || "/";
      } else if (res?.error) {
        // Handle the error response
        // Check if the error has 'data' property
        if ("data" in res.error && res.error.data) {
          const errorData = res.error.data as CheckoutErrorMessage; // Cast to the correct type

          toast(errorData?.message); // Safely access the 'data' property
        } else {
          // Handle the case where error doesn't have expected structure
          toast("An unknown error occurred.");
        }
      }
    } catch (error) {
      toast("An error occurred while processing the checkout.");
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
            <span className="font-medium">AED {shipping.toFixed(2)}</span>
          </div>
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
              AED {formatNumber(total.toFixed(2))}
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
