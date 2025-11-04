/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
import { useSingleOrderDetailsQuery } from "@/redux/features/Orders/Orders";
import OrderDetailsSkeleton from "@/components/Orders/SingleOrderDetails/OrderDetailsSkeleton";
import OrderHeader from "@/components/Orders/SingleOrderDetails/OrderHeader";
import OrderSidebarContent from "@/components/Orders/SingleOrderDetails/OrderSidebarContent";
import SingleOrderProductCard from "@/components/Orders/SingleOrderDetails/SingleOrderProductCard";
import OrderSummerySingle from "@/components/Orders/SingleOrderDetails/OrderSummerySingle";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/authSlice";
import { downloadInvoiceHealper } from "@/lib/utils/downloadInvoice";
import ProtectedRoute from "@/Provider/ProtectedRoutes";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [copied, setCopied] = useState(false);
  const token = useAppSelector(selectToken);

  const {
    data: orderDetails,
    isLoading,
    error,
  } = useSingleOrderDetailsQuery(orderId!, {
    skip: !orderId,
  });

  const order = orderDetails?.data?.attributes;

  const copyOrderNumber = () => {
    if (order?.orderID) {
      navigator.clipboard.writeText(order.orderID);
      setCopied(true);
      toast.success("Order number copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReorder = () => {
    if (!order) return;
    toast.success("Reorder functionality coming soon!");
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <EmptyStates.Error
            title="Order Not Found"
            description="We couldn't find an order with this ID. Please check the order number or contact support."
            actionLabel="Return to Orders"
            actionHref="/orders"
          />
        </div>
      </PageLayout>
    );
  }

  // Calculate subtotal from items
  const subtotal =
    order.total ||
    order.totalItems?.reduce(
      (sum: number, item: any) =>
        sum + (item.price || 0) * (item.quantity || 0),
      0
    ) ||
    0;

  // Calculate estimated delivery date (3-5 business days from order date)
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const downloadInvoice = async () => {
    if (token) {
      await downloadInvoiceHealper({ token, orderId });
    }
  };

  console.log(order);

  return (
    <ProtectedRoute allowedTypes={["admin", "customer", "seller"]}>
      <PageLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Orders", href: "/orders" },
          { label: order.orderID },
        ]}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            {/* Back Button */}
            <div>
              <Button
                variant="ghost"
                asChild
                className="pl-0 hover:pl-2 transition-all duration-200"
              >
                <Link href="/orders" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </Link>
              </Button>
            </div>

            {/* Page Title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Order Details
              </h1>
              <p className="text-muted-foreground">
                Manage and track your order #{order.orderID}
              </p>
            </div>
          </div>
        </div>

        {/* Order Header Actions */}
        <div className="mb-8">
          <OrderHeader
            copied={copied}
            copyOrderNumber={copyOrderNumber}
            downloadInvoice={downloadInvoice}
            handleReorder={handleReorder}
            order={order}
            key={order._id}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items Card */}
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    Order Items
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({order.totalItems?.length || 0} items)
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Items List */}
                <div className="space-y-6">
                  {order.totalItems?.map((item: any) => (
                    <div key={item._id}>
                      <SingleOrderProductCard item={item} />
                      <Separator className="mt-6 last:hidden" />
                    </div>
                  ))}

                  {(!order.totalItems || order.totalItems.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No items found in this order</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
                    <span className="font-medium">
                      {order.totalItems.length}
                    </span>
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

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="space-y-6">
            <OrderSidebarContent
              order={order}
              estimatedDelivery={estimatedDelivery}
            />
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
