/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  MapPin,
  MessageCircle,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
import { Skeleton } from "@/components/UI/skeleton";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/checkout";
import { useSingleOrderDetailsQuery } from "@/redux/features/Orders/Orders";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  processing: {
    label: "Processing",
    icon: RefreshCw,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

function OrderTimeline({
  status,
  createdAt,
}: {
  status: OrderStatus;
  createdAt: string;
}) {
  const events = [
    {
      id: "1",
      title: "Order Placed",
      description: "Your order has been received",
      timestamp: createdAt,
      type: "order" as const,
    },
    {
      id: "2",
      title: "Order Confirmed",
      description: "Your order has been confirmed",
      timestamp: new Date(
        new Date(createdAt).getTime() + 30 * 60000
      ).toISOString(),
      type: "confirmation" as const,
    },
    ...(status !== "pending" && status !== "cancelled"
      ? [
          {
            id: "3",
            title: "Processing",
            description: "Your order is being processed",
            timestamp: new Date(
              new Date(createdAt).getTime() + 60 * 60000
            ).toISOString(),
            type: "processing" as const,
          },
        ]
      : []),
    ...(status === "shipped" || status === "delivered"
      ? [
          {
            id: "4",
            title: "Shipped",
            description: "Your order has been shipped",
            timestamp: new Date(
              new Date(createdAt).getTime() + 120 * 60000
            ).toISOString(),
            type: "shipping" as const,
            metadata: {
              trackingNumber: "TRK123456789",
              carrier: "Standard Shipping",
            },
          },
        ]
      : []),
    ...(status === "delivered"
      ? [
          {
            id: "5",
            title: "Delivered",
            description: "Your order has been delivered",
            timestamp: new Date(
              new Date(createdAt).getTime() + 24 * 60 * 60000
            ).toISOString(),
            type: "delivery" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2",
                  event.type === "delivery"
                    ? "bg-green-500 border-green-500"
                    : "bg-blue-500 border-blue-500"
                )}
              />
              {!isLast && (
                <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{event.title}</h4>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
              {event.metadata && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {event.metadata.trackingNumber && (
                    <div>Tracking: {event.metadata.trackingNumber}</div>
                  )}
                  {event.metadata.carrier && (
                    <div>Carrier: {event.metadata.carrier}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back Button Skeleton */}
      <Skeleton className="h-10 w-32" />

      {/* Order Header Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 ml-auto" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const [copied, setCopied] = useState(false);

  const {
    data: orderDetails,
    isLoading,
    error,
  } = useSingleOrderDetailsQuery(orderId!, {
    skip: !orderId,
  });

  const order = orderDetails?.data?.attributes;
  console.log(order);

  const copyOrderNumber = () => {
    if (order?.orderID) {
      navigator.clipboard.writeText(order.orderID);
      setCopied(true);
      alert("Order number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyTrackingNumber = () => {
    toast.success("Tracking number copied!");
  };

  const handleReorder = () => {
    if (!order) return;
    toast.success("Reorder functionality coming soon!");
  };

  const handleCancelOrder = () => {
    if (!order) return;
    toast.success("Order cancellation request submitted");
  };

  if (isLoading) {
    return (
      <PageLayout title="Order Details" description="Loading order details...">
        <OrderDetailsSkeleton />
      </PageLayout>
    );
  }

  if (error || !order) {
    return (
      <PageLayout
        title="Order Not Found"
        description="Order details could not be found"
      >
        <EmptyStates.Error
          title="Order Not Found"
          description="We couldn't find an order with this ID. Please check the order number or contact support."
          actionLabel="Return to Orders"
          actionHref="/orders"
        />
      </PageLayout>
    );
  }

  const status = statusConfig[order.status as OrderStatus];
  const StatusIcon = status.icon;

  // Calculate subtotal from items
  const subtotal = order.totalItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  // Calculate estimated delivery date (3-5 business days from order date)
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Company Details
    doc.setFontSize(16);
    doc.text("Company Name", 20, 20);
    doc.setFontSize(12);
    doc.text("Company Address: 123 Business St, NY, USA", 20, 30);
    doc.text("Phone: +1234567890", 20, 40);

    // Customer and Order Information
    doc.setFontSize(14);
    doc.text(`Order ID: ${order.orderID}`, 20, 60);
    doc.text(
      `Customer: ${order.shippingInformation.firstName} ${order.shippingInformation.lastName}`,
      20,
      70
    );
    doc.text(`Email: ${order.shippingInformation.email}`, 20, 80);
    doc.text(`Phone: ${order.shippingInformation.phoneNumber}`, 20, 90);
    doc.text(
      `Shipping Address: ${order.shippingInformation.streetAddress}, ${order.shippingInformation.city}, ${order.shippingInformation.state}, ${order.shippingInformation.zipCode}, ${order.shippingInformation.country}`,
      20,
      100
    );

    doc.text(`Order Notes: ${order.orderNotes}`, 20, 120);

    // Table for Order Items
    let yOffset = 130;
    doc.setFontSize(12);
    doc.text("Items Purchased:", 20, yOffset);

    // Table headers
    const tableHeaders = ["# No.", "Product ID", "Quantity", "Price", "Total"];
    const cellWidth = [20, 40, 30, 30, 30]; // Define column widths
    yOffset += 10;

    // Draw header
    doc.setFontSize(10);
    tableHeaders.forEach((header, i) => {
      doc.text(header, 20 + i * 40, yOffset);
    });

    // Draw item rows
    yOffset += 10;
    order.totalItems.forEach((item: any, index: any) => {
      doc.text(`${index + 1}`, 20, yOffset);
      doc.text(item.productId, 60, yOffset);
      doc.text(item.quantity.toString(), 100, yOffset);
      doc.text(`$${item.price}`, 130, yOffset);
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 160, yOffset);
      yOffset += 10;
    });

    // Total Section (Subtotal, Tax, etc.)
    yOffset += 10;
    doc.text("Total Details:", 20, yOffset);
    yOffset += 10;
    doc.text(`Subtotal: $${order.total.toFixed(2)}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Shipping: $${order.shipping.toFixed(2)}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Tax: $${order.tax.toFixed(2)}`, 20, yOffset);
    yOffset += 10;
    doc.text(
      `Total Amount: $${(order.total + order.shipping + order.tax).toFixed(2)}`,
      20,
      yOffset
    );

    // Download PDF
    doc.save(`Invoice_${order.orderID}.pdf`);
  };

  return (
    <PageLayout
      title={`Order ${order.orderID}`}
      description="View order details and track your purchase"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Orders", href: "/orders" },
        { label: order.orderID },
      ]}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      {/* Order Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-lg", status.bgColor)}>
                <StatusIcon className={cn("h-6 w-6", status.color)} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">Order {order.orderID}</h1>
                  <Badge
                    variant={
                      order.status === "delivered" ? "default" : "secondary"
                    }
                  >
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Placed on{" "}
                    {format(
                      new Date(order.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-mono">{order.orderID}</span>
                  <button
                    type="button"
                    onClick={copyOrderNumber}
                    className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    title="Copy order number"
                  >
                    <Copy
                      className={cn(
                        "h-3 w-3",
                        copied ? "text-green-600" : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:items-end gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                {/* TODO: upcoming section */}
                {/* {order.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelOrder}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel Order
                  </Button>
                )} */}
                <Button variant="outline" size="sm" onClick={handleReorder}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reorder
                </Button>
                <Button variant="outline" size="sm" onClick={downloadInvoice}>
                  <Download className="h-4 w-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.totalItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.totalItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={`Product ${item.productId}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Product ID: {item.productId}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Vendor: {item.vendorId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × $
                        {Number(item.price || 0).toFixed(2)}
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
                  <span>${Number(subtotal || 0).toFixed(2)}</span>
                </div>
                {order.coupon?.isValid && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon Discount</span>
                    <span>
                      -${Number(subtotal - order.total || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "FREE"
                      : `$${Number(order.shipping || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${Number(order.tax || 0).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                status={order.status}
                createdAt={order.createdAt}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
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
                <p className="text-sm text-muted-foreground mb-1">
                  Payment Method
                </p>
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
                Have questions about your order? Our support team is here to
                help.
              </p>
              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

// "use client";

// import { format } from "date-fns";
// import {
//   ArrowLeft,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Copy,
//   CreditCard,
//   Download,
//   ExternalLink,
//   MapPin,
//   MessageCircle,
//   Package,
//   RefreshCw,
//   Truck,
//   XCircle,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import PageLayout from "@/components/layout/PageLayout";
// import { EmptyStates } from "@/components/shared/EmptyState";
// import { Badge } from "@/components/UI/badge";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
// import { Separator } from "@/components/UI/separator";
// import { cn } from "@/lib/utils";
// import type { Order, OrderStatus } from "@/lib/checkout";
// import { OrderEvent } from "@/lib/types";
// import { useAppSelector } from "@/redux/hooks";
// import { selectCurrentUser } from "@/redux/features/auth/authSlice";
// import { useSingleOrderDetailsQuery } from "@/redux/features/Orders/Orders";

// const statusConfig: Record<
//   OrderStatus,
//   { label: string; icon: React.ElementType; color: string; bgColor: string }
// > = {
//   pending: {
//     label: "Pending",
//     icon: Clock,
//     color: "text-yellow-600",
//     bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
//   },
//   processing: {
//     label: "Processing",
//     icon: RefreshCw,
//     color: "text-blue-600",
//     bgColor: "bg-blue-100 dark:bg-blue-900/30",
//   },
//   shipped: {
//     label: "Shipped",
//     icon: Truck,
//     color: "text-purple-600",
//     bgColor: "bg-purple-100 dark:bg-purple-900/30",
//   },
//   delivered: {
//     label: "Delivered",
//     icon: CheckCircle,
//     color: "text-green-600",
//     bgColor: "bg-green-100 dark:bg-green-900/30",
//   },
//   cancelled: {
//     label: "Cancelled",
//     icon: XCircle,
//     color: "text-red-600",
//     bgColor: "bg-red-100 dark:bg-red-900/30",
//   },
// };

// function OrderTimeline({ events }: { events: OrderEvent[] }) {
//   return (
//     <div className="space-y-4">
//       {events.map((event, index) => {
//         const isLast = index === events.length - 1;

//         return (
//           <div key={event.id} className="flex gap-4">
//             <div className="flex flex-col items-center">
//               <div
//                 className={cn(
//                   "w-3 h-3 rounded-full border-2",
//                   event.type === "delivery"
//                     ? "bg-green-500 border-green-500"
//                     : event.type === "cancellation"
//                     ? "bg-red-500 border-red-500"
//                     : "bg-blue-500 border-blue-500"
//                 )}
//               />
//               {!isLast && (
//                 <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
//               )}
//             </div>
//             <div className="flex-1 pb-8">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-medium">{event.title}</h4>
//                 <span className="text-sm text-muted-foreground">
//                   {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
//                 </span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 {event.description}
//               </p>
//               {event.metadata && (
//                 <div className="mt-2 text-xs text-muted-foreground">
//                   {event.metadata.trackingNumber && (
//                     <div>Tracking: {event.metadata.trackingNumber}</div>
//                   )}
//                   {event.metadata.carrier && (
//                     <div>Carrier: {event.metadata.carrier}</div>
//                   )}
//                   {event.metadata.location && (
//                     <div>Location: {event.metadata.location}</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default function OrderDetailsPage() {
//   const params: Record<string, string | string[]> | null = useParams();
//   const router = useRouter();
//   const orderId = params ? (params.id as string | null) : null;
//   const [order, setOrder] = useState<Order | null>(null);
//   const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [copied, setCopied] = useState(false);
//   const user = useAppSelector(selectCurrentUser);
//   const { data: orderDetails } = useSingleOrderDetailsQuery(orderId!);

//   console.log(orderDetails?.data?.attributes, "signle Order details");

//   useEffect(() => {
//     if (!user) {
//       router.push("/sign-in?redirect=/orders");
//       return;
//     }

//     // Load orders and find the specific order
//     // const orders = loadUserOrders(MOCK_USER.id);
//     // const foundOrder = getOrderById(orderId, orders);

//     // if (foundOrder) {
//     //   setOrder(foundOrder);
//     //   setOrderEvents(generateOrderEvents(foundOrder));
//     // }
//     setIsLoading(false);
//   }, [orderId, router]); // Removed user from dependencies since it's now a constant

//   const copyOrderNumber = () => {
//     if (order) {
//       navigator.clipboard.writeText(order.orderNumber);
//       setCopied(true);
//       toast.success("Order number copied!");
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const copyTrackingNumber = () => {
//     if (order?.trackingNumber) {
//       navigator.clipboard.writeText(order.trackingNumber);
//       toast.success("Tracking number copied!");
//     }
//   };

//   const handleReorder = () => {
//     if (!order) return;

//     try {
//       // Add all items to cart
//       order.items.forEach((item) => {
//         // In a real app, you'd fetch the current product data
//         // For now, we'll simulate adding to cart
//         for (let i = 0; i < item.quantity; i++) {
//           // addToCart would need the full product object
//           // This is a simplified simulation
//         }
//       });

//       toast.success(`${order.items.length} item(s) added to cart`);
//       router.push("/cart");
//     } catch (_error) {
//       toast.error("Failed to reorder items");
//     }
//   };

//   const handleCancelOrder = () => {
//     // if (!order || !canCancelOrder(order)) return;

//     // In a real app, this would call an API
//     toast.success("Order cancellation request submitted");
//   };

//   if (isLoading) {
//     return (
//       <PageLayout title="Order Details" description="Loading order details...">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </PageLayout>
//     );
//   }

//   if (!order) {
//     return (
//       <PageLayout
//         title="Order Not Found"
//         description="Order details could not be found"
//       >
//         <EmptyStates.Error
//           title="Order Not Found"
//           description="We couldn't find an order with this ID. Please check the order number or contact support."
//           actionLabel="Return to Orders"
//           actionHref="/orders"
//         />
//       </PageLayout>
//     );
//   }

//   const status = statusConfig[order.status];
//   const StatusIcon = status.icon;

//   return (
//     <PageLayout
//       title={`Order ${order.orderNumber}`}
//       description="View order details and track your purchase"
//       breadcrumbs={[
//         { label: "Dashboard", href: "/dashboard" },
//         { label: "Orders", href: "/orders" },
//         { label: order.orderNumber },
//       ]}
//     >
//       {/* Back Button */}
//       <div className="mb-6">
//         <Button variant="ghost" asChild>
//           <Link href="/orders">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Orders
//           </Link>
//         </Button>
//       </div>

//       {/* Order Header */}
//       <Card className="mb-6">
//         <CardContent className="pt-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex items-start gap-4">
//               <div className={cn("p-3 rounded-lg", status.bgColor)}>
//                 <StatusIcon className={cn("h-6 w-6", status.color)} />
//               </div>
//               <div>
//                 <div className="flex items-center gap-3 mb-2">
//                   <h1 className="text-2xl font-bold">
//                     Order {order.orderNumber}
//                   </h1>
//                   <Badge
//                     variant={
//                       order.status === "delivered" ? "default" : "secondary"
//                     }
//                   >
//                     {status.label}
//                   </Badge>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//                   <Calendar className="h-4 w-4" />
//                   <span>
//                     Placed on{" "}
//                     {format(
//                       new Date(order.createdAt),
//                       "MMMM d, yyyy 'at' h:mm a"
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="text-muted-foreground">Order Number:</span>
//                   <span className="font-mono">{order.orderNumber}</span>
//                   <button
//                     type="button"
//                     onClick={copyOrderNumber}
//                     className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
//                     title="Copy order number"
//                   >
//                     <Copy
//                       className={cn(
//                         "h-3 w-3",
//                         copied ? "text-green-600" : "text-muted-foreground"
//                       )}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col lg:items-end gap-3">
//               <div className="text-right">
//                 <p className="text-sm text-muted-foreground">Total Amount</p>
//                 <p className="text-2xl font-bold">
//                   ${Number(order.total || 0).toFixed(2)}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 {/* {canCancelOrder(order) && ( */}
//                 <Button variant="outline" size="sm" onClick={handleCancelOrder}>
//                   <XCircle className="h-4 w-4 mr-1" />
//                   Cancel Order
//                 </Button>
//                 {/* )} */}
//                 <Button variant="outline" size="sm" onClick={handleReorder}>
//                   <RefreshCw className="h-4 w-4 mr-1" />
//                   Reorder
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <Download className="h-4 w-4 mr-1" />
//                   Invoice
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Order Items */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Package className="h-5 w-5" />
//                 Order Items ({order.items.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {order.items.map((item, index) => (
//                   <div
//                     key={`${item.title || item.name}-${item.price}-${index}`}
//                     className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
//                   >
//                     <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
//                       <Image
//                         src={item.image || "/placeholder.jpg"}
//                         alt={item.title || item.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-medium">{item.title || item.name}</h4>
//                       {item.vendor && (
//                         <p className="text-sm text-muted-foreground">
//                           Sold by {item.vendor}
//                         </p>
//                       )}
//                       <p className="text-sm text-muted-foreground">
//                         Qty: {item.quantity} × $
//                         {Number(item.price || 0).toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold">
//                         ${Number((item.price || 0) * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <Separator className="my-4" />

//               {/* Order Summary */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal</span>
//                   <span>${Number(order.subtotal || 0).toFixed(2)}</span>
//                 </div>
//                 {order.discount > 0 && (
//                   <div className="flex justify-between text-sm text-green-600">
//                     <span>Discount</span>
//                     <span>-${Number(order.discount || 0).toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <span>
//                     {order.shipping === 0
//                       ? "FREE"
//                       : `${Number(order.shipping || 0).toFixed(2)}`}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Tax</span>
//                   <span>${Number(order.tax || 0).toFixed(2)}</span>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between font-semibold text-lg">
//                   <span>Total</span>
//                   <span>${Number(order.total || 0).toFixed(2)}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Order Timeline */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Timeline</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <OrderTimeline events={orderEvents} />
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Delivery Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Truck className="h-5 w-5" />
//                 Delivery Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* {canTrackOrder(order) && ( */}
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Tracking Number
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono text-sm">
//                     {order.trackingNumber}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={copyTrackingNumber}
//                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
//                   >
//                     <Copy className="h-3 w-3" />
//                   </button>
//                   <Button variant="ghost" size="sm" asChild>
//                     <a
//                       href={`https://track.emiratespost.ae/track/${order.trackingNumber}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <ExternalLink className="h-3 w-3" />
//                     </a>
//                   </Button>
//                 </div>
//               </div>
//               {/* )} */}

//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Estimated Delivery
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <p className="font-medium">
//                     {format(
//                       new Date(order.estimatedDelivery),
//                       "EEEE, MMMM d, yyyy"
//                     )}
//                   </p>
//                 </div>
//               </div>

//               <Separator />

//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Shipping Address
//                 </p>
//                 <div className="flex items-start gap-2">
//                   <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
//                   <div className="text-sm">
//                     <p className="font-medium">
//                       {order.shippingAddress.firstName}{" "}
//                       {order.shippingAddress.lastName}
//                     </p>
//                     <p>{order.shippingAddress.address}</p>
//                     {order.shippingAddress.address2 && (
//                       <p>{order.shippingAddress.address2}</p>
//                     )}
//                     <p>
//                       {order.shippingAddress.city},{" "}
//                       {order.shippingAddress.state}{" "}
//                       {order.shippingAddress.postalCode}
//                     </p>
//                     <p>{order.shippingAddress.country}</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Payment Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Payment Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Payment Method
//                 </p>
//                 <p className="font-medium">
//                   {typeof order.paymentMethod === "string"
//                     ? order.paymentMethod
//                     : order.paymentMethod.type === "card" &&
//                       order.paymentMethod.cardNumber
//                     ? `Card ending in ${order.paymentMethod.cardNumber.slice(
//                         -4
//                       )}`
//                     : order.paymentMethod.type === "paypal"
//                     ? "PayPal"
//                     : "Unknown"}
//                 </p>
//               </div>

//               <Separator />

//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Billing Address
//                 </p>
//                 <div className="text-sm">
//                   <p className="font-medium">
//                     {order.billingAddress.firstName}{" "}
//                     {order.billingAddress.lastName}
//                   </p>
//                   <p>{order.billingAddress.address}</p>
//                   {order.billingAddress.address2 && (
//                     <p>{order.billingAddress.address2}</p>
//                   )}
//                   <p>
//                     {order.billingAddress.city}, {order.billingAddress.state}{" "}
//                     {order.billingAddress.postalCode}
//                   </p>
//                   <p>{order.billingAddress.country}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Support */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Need Help?</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Have questions about your order? Our support team is here to
//                 help.
//               </p>
//               <Button variant="outline" className="w-full">
//                 <MessageCircle className="h-4 w-4 mr-2" />
//                 Contact Support
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageLayout>
//   );
// }
