/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  MapPin,
  MessageCircle,
  Truck,
} from "lucide-react";

import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";

function OrderSidebarContent({
  order,
  estimatedDelivery,
}: {
  estimatedDelivery: any;
  order: any;
}) {
  return (
    <div className="space-y-6">
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
                {format(estimatedDelivery, "EEEE, MMMM d, yyyy")}
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
                  {order.shippingInformation.firstName}{" "}
                  {order.shippingInformation.lastName}
                </p>
                <p>{order.shippingInformation.streetAddress}</p>
                {order.shippingInformation.apartment && (
                  <p>{order.shippingInformation.apartment}</p>
                )}
                <p>
                  {order.shippingInformation.city},{" "}
                  {order.shippingInformation.state}{" "}
                  {order.shippingInformation.zipCode}
                </p>
                <p>{order.shippingInformation.country}</p>
                <p className="mt-1">{order.shippingInformation.email}</p>
                <p>{order.shippingInformation.phoneNumber}</p>
                {order.shippingInformation.deliveryInstructions && (
                  <div className="mt-2 p-2 bg-muted/50 rounded">
                    <p className="font-medium text-xs">
                      Delivery Instructions:
                    </p>
                    <p className="text-xs">
                      {order.shippingInformation.deliveryInstructions}
                    </p>
                  </div>
                )}
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
            <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
            <p className="font-medium">
              {order.paymentCardId ? (
                <>
                  Card ending in {order.paymentCardId.cardNumber?.slice(-4)}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {order.paymentCardId.cardHolderName}
                  </span>
                </>
              ) : (
                "Credit Card"
              )}
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Billing Address
            </p>
            <div className="text-sm">
              <p className="font-medium">
                {order.shippingInformation.firstName}{" "}
                {order.shippingInformation.lastName}
              </p>
              <p>{order.shippingInformation.streetAddress}</p>
              {order.shippingInformation.apartment && (
                <p>{order.shippingInformation.apartment}</p>
              )}
              <p>
                {order.shippingInformation.city},{" "}
                {order.shippingInformation.state}{" "}
                {order.shippingInformation.zipCode}
              </p>
              <p>{order.shippingInformation.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      {order.orderNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {order.orderNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Have questions about your order? Our support team is here to help.
          </p>
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderSidebarContent;
