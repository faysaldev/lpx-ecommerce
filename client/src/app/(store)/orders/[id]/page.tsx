/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
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
import OrderTimeline from "@/components/Orders/SingleOrderDetails/OrderTimeline";
import OrderDetailsSkeleton from "@/components/Orders/SingleOrderDetails/OrderDetailsSkeleton";
import OrderHeader from "@/components/Orders/SingleOrderDetails/OrderHeader";
import OrderSidebarContent from "@/components/Orders/SingleOrderDetails/OrderSidebarContent";
import SingleOrderProductCard from "@/components/Orders/SingleOrderDetails/SingleOrderProductCard";
import OrderSummerySingle from "@/components/Orders/SingleOrderDetails/OrderSummerySingle";
import { useAppSelector } from "@/redux/hooks";
import { selectToken } from "@/redux/features/auth/authSlice";
import { downloadInvoiceHealper } from "@/lib/utils/downloadInvoice";
import { OrderStatus } from "@/lib/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  conformed: {
    label: "Conformed",
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
  const subtotal =
    order.total ||
    order.totalItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

  // Calculate estimated delivery date (3-5 business days from order date)
  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const downloadInvoice = async () => {
    await downloadInvoiceHealper({ token: token ?? "", orderId });
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
      <OrderHeader
        StatusIcon={StatusIcon}
        copied={copied}
        copyOrderNumber={copyOrderNumber}
        downloadInvoice={downloadInvoice}
        handleReorder={handleReorder}
        order={order}
        status={status}
        key={order._id}
      />

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
                  <SingleOrderProductCard item={item} key={item._id} />
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <OrderSummerySingle order={order} subtotal={subtotal} />
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
        <OrderSidebarContent
          order={order}
          estimatedDelivery={estimatedDelivery}
        />
      </div>
    </PageLayout>
  );
}
