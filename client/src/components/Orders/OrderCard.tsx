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
import { OrderStatus } from "@/lib/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  confirmed: { label: "confirmed", icon: RefreshCw, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
};

function OrderCard({ order }: { order: any; onReorder: (order: any) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const status = statusConfig[order.status as OrderStatus];
  const StatusIcon = status?.icon;
  const token = useAppSelector(selectToken);

  const downloadInvoice = async () => {
    await downloadInvoiceHealper({ token: token ?? "", orderId: order?._id });
  };

  // Fix hydration by only rendering date on client
  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(order);

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
                <Badge
                  variant={
                    order.status === "delivered" ? "default" : "secondary"
                  }
                >
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
                Order Items ({order.totalItems.length})
              </h4>
              <div className="space-y-3">
                {order.totalItems.map((item: any) => {
                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <img
                          src={item?.productId?.images[0]}
                          className="h-8 w-8"
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
                          : `${Number(order.shipping).toFixed(2)}`}
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
