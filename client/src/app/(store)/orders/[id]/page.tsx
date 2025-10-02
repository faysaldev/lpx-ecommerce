/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Separator } from "@/components/UI/separator";
import type { OrderStatus } from "@/lib/checkout";
import { useSingleOrderDetailsQuery } from "@/redux/features/Orders/Orders";
import OrderTimeline from "@/components/Orders/SingleOrderDetails/OrderTimeline";
import OrderDetailsSkeleton from "@/components/Orders/SingleOrderDetails/OrderDetailsSkeleton";
import OrderHeader from "@/components/Orders/SingleOrderDetails/OrderHeader";
import OrderSidebarContent from "@/components/Orders/SingleOrderDetails/OrderSidebarContent";
import SingleOrderProductCard from "@/components/Orders/SingleOrderDetails/SingleOrderProductCard";
import OrderSummerySingle from "@/components/Orders/SingleOrderDetails/OrderSummerySingle";

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

export default function OrderDetailsPage() {
  const params = useParams();
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
