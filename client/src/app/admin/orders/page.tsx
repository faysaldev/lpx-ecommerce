"use client";

import {
  CheckCircle,
  Eye,
  MoreHorizontal,
  Package,
  Search,
  ShoppingCart,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Input } from "@/components/UI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import {
  useAdminOrdersStatsQuery,
  useSearchAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/admin/AdminOrders";
// Updated types based on API response
export interface AdminOrder {
  _id: string;
  orderID: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  status: "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  totalItems: Array<{
    productId: string;
    image?: string;
    quantity: number;
    price: number;
    vendorId?: string;
    _id: string;
  }>;
  createdAt: string;
  itemsCount: number;
  vendor?: {
    _id: string;
    storeName: string;
  };
}

interface OrdersStats {
  totalOrders: number;
  conformedOrders: number;
  deliveredOrders: number;
  totalSales: number;
}

export default function OrdersManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<OrdersStats>({
    totalOrders: 0,
    conformedOrders: 0,
    deliveredOrders: 0,
    totalSales: 0,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useAdminOrdersStatsQuery({});

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useSearchAdminOrdersQuery({ query: searchQuery });

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  useEffect(() => {
    if (ordersData?.data?.attributes) {
      setOrders(ordersData.data.attributes);
    }
  }, [ordersData]);

  useEffect(() => {
    if (statsData?.data?.attributes) {
      setStats(statsData.data.attributes);
    }
  }, [statsData]);

  // Handle order status update
  const handleUpdateStatus = async (
    orderId: string,
    newStatus: AdminOrder["status"]
  ) => {
    try {
      console.log(orderId);
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      refetchOrders();
      refetchStats();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Handle view order details
  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.orderID.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query) ||
      order.vendor?.storeName.toLowerCase().includes(query) ||
      false
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      confirmed: "secondary",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };

    const colors: Record<string, string> = {
      confirmed: "text-blue-600",
      shipped: "text-purple-600",
      delivered: "text-green-600",
      cancelled: "text-red-600",
    };

    return (
      <Badge variant={variants[status] || "outline"} className={colors[status]}>
        {status === "confirmed" && <Package className="h-3 w-3 mr-1" />}
        {status === "shipped" && <Truck className="h-3 w-3 mr-1" />}
        {status === "delivered" && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === "cancelled" && <XCircle className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get next status action based on current status
  const getNextStatusAction = (currentStatus: AdminOrder["status"]) => {
    switch (currentStatus) {
      case "confirmed":
        return { label: "Mark as Shipped", status: "shipped" as const };
      case "delivered":
        return null; // No next action for delivered
      case "cancelled":
        return null; // No next action for cancelled
      default:
        return null;
    }
  };

  // Check if cancel is allowed for the status - only for confirmed orders
  const canCancel = (status: AdminOrder["status"]) => {
    return status === "confirmed" || status === "shipped";
  };

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (statsError || ordersError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Error loading orders</h2>
          <p>Please try again later</p>
          <Button
            onClick={() => {
              refetchOrders();
              refetchStats();
            }}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all customer orders across the platform
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All platform orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.conformedOrders}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.deliveredOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              AED {stats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No orders found</p>
                        <p className="text-sm">
                          {searchQuery
                            ? "Try adjusting your search"
                            : "Orders will appear here as customers place them"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const nextAction = getNextStatusAction(order.status);
                    const allowCancel = canCancel(order.status);

                    return (
                      <TableRow key={order._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {order.orderID}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  order?.customer?.image ||
                                  "/uploads/users/user.png"
                                }
                                alt={order?.customer?.name}
                              />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {order?.customer?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order?.customer?.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {order.itemsCount}
                          </span>{" "}
                          item{order.itemsCount !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          AED {order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isUpdating}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              {/* View Details - Always available */}
                              <DropdownMenuItem
                                onClick={() => handleViewOrder(order._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>

                              {/* Next Status Action - Available based on current status */}
                              {nextAction && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-white"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        order._id,
                                        nextAction.status
                                      )
                                    }
                                    disabled={isUpdating}
                                  >
                                    {nextAction.status === "shipped" && (
                                      <Truck className="mr-2 h-4 w-4" />
                                    )}
                                    {nextAction.label}
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Cancel Order - Available for conformed and shipped */}
                              {allowCancel && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      handleUpdateStatus(order._id, "cancelled")
                                    }
                                    disabled={isUpdating}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
