/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  RefreshCw,
  Truck,
  XCircle,
  Clock,
  Package,
  Home,
  RotateCcw,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader } from "@/components/UI/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { downloadInvoiceHealper } from "@/lib/utils/downloadInvoice";
import { selectToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";

import Image from "next/image";

// Extended status configuration to cover all possible statuses
const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  // Payment status
  unpaid: {
    label: "Unpaid",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "secondary",
  },

  // Order processing statuses
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "bg-blue-500",
    variant: "secondary",
  },

  // Shipping and delivery statuses
  "Pickup Scheduled": {
    label: "Pickup Scheduled",
    icon: Calendar,
    color: "bg-purple-500",
    variant: "secondary",
  },
  Pickup: {
    label: "Pickup",
    icon: Truck,
    color: "bg-indigo-500",
    variant: "secondary",
  },
  Scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "bg-indigo-500",
    variant: "secondary",
  },
  "Pickup Completed": {
    label: "Pickup Completed",
    icon: CheckCircle,
    color: "bg-green-500",
    variant: "secondary",
  },
  "Not Picked Up": {
    label: "Not Picked Up",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive",
  },
  "Inscan At Hub": {
    label: "Inscan At Hub",
    icon: Package,
    color: "bg-blue-500",
    variant: "secondary",
  },
  "Out For Delivery": {
    label: "Out For Delivery",
    icon: Truck,
    color: "bg-orange-500",
    variant: "secondary",
  },
  Delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-500",
    variant: "default",
  },
  Undelivered: {
    label: "Undelivered",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive",
  },

  // Special statuses
  "On-Hold": {
    label: "On Hold",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "secondary",
  },
  "Reached At Hub": {
    label: "Reached At Hub",
    icon: Home,
    color: "bg-blue-500",
    variant: "secondary",
  },
  RTO: {
    label: "RTO",
    icon: RotateCcw,
    color: "bg-red-500",
    variant: "destructive",
  },
  "RTO Delivered": {
    label: "RTO Delivered",
    icon: CheckCircle,
    color: "bg-green-500",
    variant: "default",
  },

  // Cancellation statuses
  Cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive",
  },

  // Other statuses
  "Order Updated": {
    label: "Order Updated",
    icon: RefreshCw,
    color: "bg-blue-500",
    variant: "secondary",
  },
  Rescheduled: {
    label: "Rescheduled",
    icon: Calendar,
    color: "bg-purple-500",
    variant: "secondary",
  },
};

// Default status for unknown statuses
const defaultStatusConfig = {
  label: "Processing",
  icon: RefreshCw,
  color: "bg-gray-500",
  variant: "secondary" as const,
};

function OrderCard({
  order,
}: {
  order: any;
  onReorder?: (order: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Safely get status configuration with fallback
  const status = statusConfig[order.status] || defaultStatusConfig;
  const StatusIcon = status.icon;
  const token = useAppSelector(selectToken);

  const downloadInvoice = async () => {
    if (token) {
      await downloadInvoiceHealper({ token, orderId: order?._id });
    }
  };

  // Fix hydration by only rendering date on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn("p-2 rounded-lg", status.color, "bg-opacity-10")}
            >
              <StatusIcon
                className={cn("h-5 w-5", status.color.replace("bg-", "text-"))}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/orders/${order._id}`}
                  className="font-semibold hover:underline"
                >
                  Order {order.orderID}
                </Link>
                <Badge variant={status.variant || "secondary"}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {mounted ? (
                  <>
                    Placed on{" "}
                    {format(
                      new Date(order.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </>
                ) : (
                  // Placeholder during SSR
                  <span className="invisible">Loading date...</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  View Details
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold">
              AED {Number(order.totalAmount || 0).toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/orders/${order._id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={downloadInvoice}>
              <FileText className="h-4 w-4 mr-1" />
              Invoice
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-3">
                Order Items ({order.items?.length || 0})
              </h4>
              <div className="space-y-3">
                {order.items?.map((item: any) => {
                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <Image
                          src={item?.image || "/placeholder-image.jpg"}
                          className="h-16 w-16 object-cover rounded-md"
                          height={64}
                          width={64}
                          alt={item.productId?.productName || "Product Image"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.productId?.productName || "Product"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × AED
                          {Number(item.price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Vendor: {item.vendorId?.storeName || "N/A"}
                        </p>
                      </div>
                      <p className="font-semibold">
                        AED {` `}
                        {Number(
                          (item.quantity || 0) * (item.price || 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Shipping Information</h4>
                <div className="text-sm text-muted-foreground">
                  {order.shippingInformation ? (
                    <>
                      <p>
                        {order.shippingInformation.firstName}{" "}
                        {order.shippingInformation.lastName}
                      </p>
                      <p>{order.shippingInformation.email}</p>
                      <p>{order.shippingInformation.phoneNumber}</p>
                      <p>{order.shippingInformation.streetAddress}</p>
                      {order.shippingInformation.apartment && (
                        <p>{order.shippingInformation.apartment}</p>
                      )}
                      {order.shippingInformation.city && (
                        <p>
                          {order.shippingInformation.city}
                          {order.shippingInformation.state &&
                            `, ${order.shippingInformation.state}`}
                          {order.shippingInformation.zipCode &&
                            ` ${order.shippingInformation.zipCode}`}
                        </p>
                      )}
                      {!order.shippingInformation.city &&
                        order.shippingInformation.state && (
                          <p>
                            {order.shippingInformation.state}
                            {order.shippingInformation.zipCode &&
                              ` ${order.shippingInformation.zipCode}`}
                          </p>
                        )}
                      <p>{order.shippingInformation.country}</p>
                      {order.shippingInformation.deliveryInstructions && (
                        <p className="mt-2">
                          <strong>Delivery Instructions:</strong>{" "}
                          {order.shippingInformation.deliveryInstructions}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>No shipping information available</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items Total</span>
                    <span>AED {Number(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  {order.shipping !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {order.shipping === 0
                          ? "FREE"
                          : `AED ${Number(order.shipping).toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  {order.tax !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>AED {Number(order.tax).toFixed(2)}</span>
                    </div>
                  )}
                  {order.coupon?.isValid && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>
                        -AED{" "}
                        {Number(order.coupon?.discountAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total Amount</span>
                    <span>AED {Number(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>

                {order.orderNotes && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Order Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {order.orderNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderCard;
