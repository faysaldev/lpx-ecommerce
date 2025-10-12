/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Edit,
  Loader2,
  MapPin,
  Package,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/UI/button.variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Checkbox } from "@/components/UI/checkbox";
import { Separator } from "@/components/UI/separator";
import { Textarea } from "@/components/UI/textarea";
// import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import { cn } from "@/lib/utils";
import type { BillingAddress, ShippingAddress } from "@/lib/checkout";
import { Label } from "@/components/UI/label";

const OrderReview = () => {
  const {
    checkoutData,
    prevStep,
    setCurrentStep,
    nextStep,
    updateCheckoutData,
  } = useCheckout();
  
  // Debug: log checkout data to console
  useEffect(() => {
    console.log("Order Review - Full Checkout Data:", checkoutData);
    
    // Log each part of the checkout data
    console.log("Shipping Address:", checkoutData.shippingAddress);
    console.log("Billing Address:", checkoutData.billingAddress);
    console.log("Same as Shipping:", checkoutData.sameAsShipping);
    console.log("Payment Method:", checkoutData.paymentMethod);
    console.log("Accept Terms:", checkoutData.acceptTerms);
    console.log("Subscribe Newsletter:", checkoutData.subscribeNewsletter);
    console.log("Order Notes:", checkoutData.orderNotes);
  }, [checkoutData]);

  // You would normally get items from cart context, but for now we'll use mock data
  // In a real implementation, you would use useCart() hook
  const items = [
    {
      id: "1",
      productId: "101",
      name: "Product A",
      price: 100,
      quantity: 2,
      image: "https://via.placeholder.com/150",
      vendor: "Vendor A",
      product: {
        id: "101",
        name: "Product A",
        price: 100,
        compareAtPrice: 120,
        description: "A high-quality product.",
        category: "Electronics",
        stock: 5,
        state: "sealed",
        grading: undefined,
        condition: undefined,
        rarity: "Rare",
      },
    },
    {
      id: "2",
      productId: "102",
      name: "Product B",
      price: 50,
      quantity: 1,
      image: "https://via.placeholder.com/150",
      vendor: "Vendor B",
      product: {
        id: "102",
        name: "Product B",
        price: 50,
        compareAtPrice: 60,
        description: "Affordable product.",
        category: "Home Appliances",
        stock: 10,
        state: "open",
        grading: { company: "PSA", grade: "9" },
        condition: "Near Mint",
        rarity: "Common",
      },
    },
  ];

  // Calculate the necessary totals and values for the checkout
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = checkoutData.shipping  || 10; 
  const tax = subtotal * 0.1; // 10% tax
  const discount = checkoutData.discount || 0; 
  const total = subtotal + shipping + tax - discount;

  const [orderNotes, setOrderNotesLocal] = useState(checkoutData.orderNotes || "");
  const [acceptTerms, setAcceptTermsLocal] = useState(checkoutData.acceptTerms || false);
  const [subscribeNewsletter, setSubscribeNewsletterLocal] = useState(checkoutData.subscribeNewsletter || false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePlaceOrder = async () => {
    // Update checkout data with the current values
    updateCheckoutData({
      ...checkoutData,
      orderNotes,
      acceptTerms,
      subscribeNewsletter
    });
    
    // Here you would typically place the actual order
    // For now, we'll just log the data
    console.log("Attempting to place order with data:", {
      checkoutData,
      orderNotes,
      acceptTerms,
      subscribeNewsletter
    });
    
    // Simulate order processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, this would navigate to the order confirmation page
      console.log("Order placed successfully!");
    }, 2000);

    nextStep();
  };

  const formatAddress = (
    address: ShippingAddress | BillingAddress | null | any
  ) => {
    if (!address) return "";
    return `${address.firstName} ${address.lastName}
${address.address}${address.address2 ? `, ${address.address2}` : ""}
${address.city}, ${address.state} ${address.postalCode}
${address.country}`;
  };

  const getPaymentMethodDisplay = () => {
    if (!checkoutData.paymentMethod) return "";

    switch (checkoutData.paymentMethod.type) {
      case "card": {
        const lastFour = checkoutData.paymentMethod.cardNumber?.slice(-4) || "";
        return `Card ending in ${lastFour}`;
      }
      case "paypal":
        return "PayPal";
      case "crypto":
        return "Cryptocurrency";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Items</span>
            <span className="text-sm font-normal text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={item.product.image || item.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${Number(item.product.price || 0).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${Number((item.product.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipping Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Shipping Address
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("shipping")}
                className="text-primary hover:underline"
              >
                <Edit className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {formatAddress(checkoutData?.shippingAddress)}
            </p>
            {checkoutData.shippingAddress?.phone && (
              <p className="text-sm text-muted-foreground mt-2">
                Phone: {checkoutData.shippingAddress.phone}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Billing Address
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("billing")}
                className="text-primary hover:underline"
              >
                <Edit className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkoutData.sameAsShipping ? (
              <p className="text-sm text-muted-foreground">
                Same as shipping address
              </p>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {formatAddress(checkoutData.billingAddress)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("payment")}
                className="text-primary hover:underline"
              >
                <Edit className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getPaymentMethodDisplay()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${Number(subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `${Number(shipping || 0).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${Number(tax || 0).toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-${Number(discount || 0).toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${Number(total || 0).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <div>
        <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
        <Textarea
          id="orderNotes"
          value={orderNotes}
          onChange={(e) => setOrderNotesLocal(e.target.value)}
          placeholder="Add any special instructions for your order..."
          rows={3}
          className="mt-2"
        />
      </div>

      {/* Terms and Newsletter */}
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTermsLocal(!!checked)}
            className="mt-0.5"
          />
          <Label
            htmlFor="acceptTerms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            *
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="subscribeNewsletter"
            checked={subscribeNewsletter}
            onCheckedChange={(checked) => setSubscribeNewsletterLocal(!!checked)}
            className="mt-0.5"
          />
          <Label
            htmlFor="subscribeNewsletter"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Send me exclusive offers and updates about new collectibles
          </Label>
        </div>
      </div>

      {/* Error Message */}
      {!acceptTerms && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Please accept the terms and conditions to continue
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t">
        <SecondaryButton
          type="button"
          onClick={prevStep}
          disabled={isProcessing}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment
        </SecondaryButton>
        <PrimaryButton
          onClick={handlePlaceOrder}
          size="lg"
          disabled={!acceptTerms || isProcessing}
          className={cn("min-w-[200px]", isProcessing && "cursor-not-allowed")}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Place Order (${Number(total || 0).toFixed(2)})
            </>
          )}
        </PrimaryButton>
      </div>
    </div>
  );
} 

export default OrderReview
