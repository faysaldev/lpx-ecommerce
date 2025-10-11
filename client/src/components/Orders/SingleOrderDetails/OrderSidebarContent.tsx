/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { MapPin, Truck, Package, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface OrderSidebarContentProps {
  order: any;
  estimatedDelivery: Date;
}

export default function OrderSidebarContent({
  order,
  estimatedDelivery,
}: OrderSidebarContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-5 w-5" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Estimated Delivery</p>
            <p className="text-sm text-muted-foreground">
              {mounted ? (
                format(estimatedDelivery, "MMMM d, yyyy")
              ) : (
                <span className="invisible">Loading...</span>
              )}
            </p>
          </div>
          {order.trackingNumber && (
            <div>
              <p className="text-sm font-medium mb-1">Tracking Number</p>
              <p className="text-sm text-muted-foreground font-mono">
                {order.trackingNumber}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p className="font-medium">
              {order.shippingInformation.firstName}{" "}
              {order.shippingInformation.lastName}
            </p>
            <p className="text-muted-foreground">
              {order.shippingInformation.email}
            </p>
            <p className="text-muted-foreground">
              {order.shippingInformation.phoneNumber}
            </p>
            <p className="text-muted-foreground mt-2">
              {order.shippingInformation.streetAddress}
            </p>
            {order.shippingInformation.apartment && (
              <p className="text-muted-foreground">
                {order.shippingInformation.apartment}
              </p>
            )}
            <p className="text-muted-foreground">
              {order.shippingInformation.city &&
                `${order.shippingInformation.city}, `}
              {order.shippingInformation.state}
              {order.shippingInformation.zipCode &&
                ` ${order.shippingInformation.zipCode}`}
            </p>
            <p className="text-muted-foreground">
              {order.shippingInformation.country}
            </p>
            {order.shippingInformation.deliveryInstructions && (
              <div className="mt-3 p-2 bg-muted/50 rounded">
                <p className="text-xs font-medium mb-1">
                  Delivery Instructions:
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.shippingInformation.deliveryInstructions}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      {order.billingInformation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              {order.billingInformation.firstName &&
              order.billingInformation.lastName ? (
                <>
                  <p className="font-medium">
                    {order.billingInformation.firstName}{" "}
                    {order.billingInformation.lastName}
                  </p>
                  {order.billingInformation.deliveryInstructions && (
                    <p className="text-muted-foreground mt-2">
                      {order.billingInformation.deliveryInstructions}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">
                  Same as shipping address
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{order.totalItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                AED {Number(order.total || 0).toFixed(2)}
              </span>
            </div>
            {order.shipping !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `AED ${Number(order.shipping).toFixed(2)}`
                  )}
                </span>
              </div>
            )}

            {order.coupon?.isValid && order.coupon?.discountAmount && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  -AED {Number(order.coupon.discountAmount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>AED {Number(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
