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
    </div>
  );
}
