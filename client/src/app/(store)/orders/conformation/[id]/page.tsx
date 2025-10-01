/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Calendar,
  CheckCircle,
  Copy,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SimplePageLayout } from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Alert, AlertDescription } from "@/components/UI/alert";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/UI/button.variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/checkout";

export default function OrderConfirmationPage() {
  const params: Record<string, string | string[]> | null = useParams();
  const _router = useRouter();
  const orderId = params ? (params.id as string | null) : null;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch order from localStorage
    const orders = JSON.parse(localStorage.getItem("lpx-orders") || "[]");
    const foundOrder = orders.find((o: Order) => o.id === orderId);

    if (foundOrder) {
      setOrder(foundOrder);
    }
    setIsLoading(false);
  }, [orderId]);

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      toast.success("Order number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <SimplePageLayout>
        <EmptyStates.Error
          title="Order Not Found"
          description="We couldn't find an order with this ID. Please check the order number or contact support."
          actionLabel="Return to Home"
          actionHref="/"
          onRetry={() => window.location.reload()}
        />
      </SimplePageLayout>
    );
  }

  return (
    <SimplePageLayout containerClassName="max-w-4xl py-12">
      <div>
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          {/* Order Number */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border">
            <span className="text-sm text-muted-foreground">Order Number:</span>
            <span className="font-mono font-bold">{order.orderNumber}</span>
            <button
              type="button"
              onClick={copyOrderNumber}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copy order number"
            >
              <Copy
                className={cn(
                  "h-4 w-4",
                  copied ? "text-green-600" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <Alert className="mb-8">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            A confirmation email has been sent to{" "}
            <strong>{order.shippingAddress.email}</strong> with your order
            details and tracking information.
          </AlertDescription>
        </Alert>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Estimated Delivery
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(order.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Shipping Address
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    {order.shippingAddress.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Payment Method
                </p>
                <p className="font-medium">
                  {typeof order.paymentMethod === "string"
                    ? order.paymentMethod
                    : order.paymentMethod.type === "card" &&
                      order.paymentMethod.cardNumber
                    ? `Card ending in ${order.paymentMethod.cardNumber.slice(
                        -4
                      )}`
                    : order.paymentMethod.type === "paypal"
                    ? "PayPal"
                    : "Unknown"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Billing Address
                </p>
                <div className="text-sm">
                  <p className="font-medium">
                    {order.billingAddress.firstName}{" "}
                    {order.billingAddress.lastName}
                  </p>
                  <p>{order.billingAddress.address}</p>
                  {order.billingAddress.address2 && (
                    <p>{order.billingAddress.address2}</p>
                  )}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any, index: any) => (
                <div
                  key={`${item.title}-${item.vendor}-${index}`}
                  className="flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Sold by {item.vendor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${Number((item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${Number(order.discount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "FREE"
                    : `${Number(order.shipping || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${Number(order.tax || 0).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${Number(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <SecondaryButton asChild size="lg">
            <Link href={`/orders/${order.id}`}>View Order Details</Link>
          </SecondaryButton>
          <PrimaryButton asChild size="lg">
            <Link href="/browse">Continue Shopping</Link>
          </PrimaryButton>
        </div>
      </div>
    </SimplePageLayout>
  );
}
