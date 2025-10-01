"use client";

import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  MoreHorizontal,
  Package,
  Search,
  ShoppingCart,
  Store,
  Truck,
  User,
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
  // useUpdateOrderStatusMutation,
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
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  totalAmount: number;
  totalItems: Array<{
    productId: string;
    image: string;
    quantity: number;
    price: number;
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
  pendingOrders: number;
  completedOrders: number;
  totalSales: number;
}

export default function OrdersManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<OrdersStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
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

  // const [updateOrderStatus, { isLoading: isUpdating }] =
  //   useUpdateOrderStatusMutation();

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
      // await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      refetchOrders();
      refetchStats();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Handle view order details
  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  // Filter orders based on search query (client-side as backup)
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
      pending: "outline",
      processing: "secondary",
      shipped: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const colors: Record<string, string> = {
      pending: "text-yellow-600",
      processing: "text-blue-600",
      shipped: "text-purple-600",
      completed: "text-green-600",
      cancelled: "text-red-600",
    };

    return (
      <Badge variant={variants[status] || "outline"} className={colors[status]}>
        {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
        {status === "processing" && <Package className="h-3 w-3 mr-1" />}
        {status === "shipped" && <Truck className="h-3 w-3 mr-1" />}
        {status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
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

  const getNextStatusAction = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return { label: "Mark as Processing", status: "processing" as const };
      case "processing":
        return { label: "Mark as Shipped", status: "shipped" as const };
      case "shipped":
        return { label: "Mark as Completed", status: "completed" as const };
      default:
        return null;
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all customer orders across the platform
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
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
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completedOrders}
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
            <div className="text-2xl font-bold">
              ${stats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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

                  return (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.orderID}</p>
                          {/* <p className="text-xs text-muted-foreground">
                            {order._id}
                          </p> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                order.customer.image ||
                                "/uploads/users/user.png"
                              }
                              alt={order.customer.name}
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{order.itemsCount}</span>{" "}
                        item
                        {order.itemsCount !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${order.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              // disabled={isUpdating}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewOrder(order._id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            {nextAction && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(
                                    order._id,
                                    nextAction.status
                                  )
                                }
                                // disabled={isUpdating}
                              >
                                {nextAction.status === "processing" && (
                                  <Package className="mr-2 h-4 w-4" />
                                )}
                                {nextAction.status === "shipped" && (
                                  <Truck className="mr-2 h-4 w-4" />
                                )}
                                {nextAction.status === "completed" && (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                {nextAction.label}
                              </DropdownMenuItem>
                            )}

                            {order.status === "pending" && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleUpdateStatus(order._id, "cancelled")
                                }
                                // disabled={isUpdating}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  );
}

// "use client";

// import {
//   CheckCircle,
//   Clock,
//   Download,
//   Eye,
//   MoreHorizontal,
//   Package,
//   Search,
//   ShoppingCart,
//   Store,
//   Truck,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
// import { Badge } from "@/components/UI/badge";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/UI/dropdown-menu";
// import { Input } from "@/components/UI/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/UI/table";
// import adminMockService, { type AdminOrder } from "@/lib/types/admin-mock";
// import {
//   useAdminOrdersStatsQuery,
//   useSearchAdminOrdersQuery,
// } from "@/redux/features/admin/AdminOrders";

// export default function OrdersManagement() {
//   const [orders, setOrders] = useState<AdminOrder[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const {
//     data: statsData,
//     isLoading: statsLoading,
//     error: statsError,
//   } = useAdminOrdersStatsQuery({});
//   const {
//     data: OrdersData,
//     isLoading: ordersLoading,
//     error: ordersError,
//   } = useSearchAdminOrdersQuery({ query: searchQuery });
//   console.log(statsData?.data?.attributes, "statsData");
//   console.log(OrdersData?.data?.attributes, "OrdersData");

//   useEffect(() => {
//     // Load orders from admin mock service
//     const allOrders = adminMockService.getAllOrders();
//     setOrders(allOrders);
//   }, []);

//   // Calculate statistics from actual orders
//   const stats = {
//     totalOrders: orders.length,
//     pendingOrders: orders.filter(
//       (o) => o.status === "pending" || o.status === "processing"
//     ).length,
//     completedOrders: orders.filter((o) => o.status === "completed").length,
//     totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
//   };

//   // Filter orders based on search query
//   const filteredOrders = orders.filter((order) => {
//     if (!searchQuery) return true;
//     return (
//       order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   const getStatusBadge = (status: string) => {
//     const variants: Record<
//       string,
//       "default" | "secondary" | "destructive" | "outline"
//     > = {
//       pending: "outline",
//       processing: "secondary",
//       shipped: "default",
//       completed: "default",
//       cancelled: "destructive",
//     };

//     const colors: Record<string, string> = {
//       pending: "text-yellow-600",
//       processing: "text-blue-600",
//       shipped: "text-purple-600",
//       completed: "text-green-600",
//       cancelled: "text-red-600",
//     };

//     return (
//       <Badge variant={variants[status] || "outline"} className={colors[status]}>
//         {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
//         {status === "processing" && <Package className="h-3 w-3 mr-1" />}
//         {status === "shipped" && <Truck className="h-3 w-3 mr-1" />}
//         {status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">
//             Order Management
//           </h1>
//           <p className="text-muted-foreground">
//             Monitor and manage all customer orders across the platform
//           </p>
//         </div>
//         <Button variant="outline">
//           <Download className="mr-2 h-4 w-4" />
//           Export Orders
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalOrders}</div>
//             <p className="text-xs text-muted-foreground">All platform orders</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">
//               Pending/Processing
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-600">
//               {stats.pendingOrders}
//             </div>
//             <p className="text-xs text-muted-foreground">Require attention</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Completed</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">
//               {stats.completedOrders}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Successfully delivered
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               ${stats.totalRevenue.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">Platform revenue</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Orders Table */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>All Orders</CardTitle>
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search orders..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-8 w-[300px]"
//                 />
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Order</TableHead>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Vendor</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Items</TableHead>
//                 <TableHead>Total</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredOrders.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="text-center py-8">
//                     <div className="text-muted-foreground">
//                       <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                       <p>No orders found</p>
//                       <p className="text-sm">
//                         {searchQuery
//                           ? "Try adjusting your search"
//                           : "Orders will appear here as customers place them"}
//                       </p>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredOrders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell>
//                       <div>
//                         <p className="font-medium">{order.orderNumber}</p>
//                         <p className="text-xs text-muted-foreground">
//                           {order.trackingNumber || "No tracking"}
//                         </p>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8">
//                           <AvatarImage src={order.customer.avatar} />
//                           <AvatarFallback>
//                             {order.customer.name.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{order.customer.name}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {order.customer.email}
//                           </p>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Store className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm">{order.vendor.name}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell>{formatDate(order.orderDate)}</TableCell>
//                     <TableCell>
//                       <span className="font-medium">{order.items.length}</span>{" "}
//                       item
//                       {order.items.length !== 1 ? "s" : ""}
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       ${order.total.toLocaleString()}
//                     </TableCell>
//                     <TableCell>{getStatusBadge(order.status)}</TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem>
//                             <Eye className="mr-2 h-4 w-4" />
//                             View Details
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>
//                             <Package className="mr-2 h-4 w-4" />
//                             Track Package
//                           </DropdownMenuItem>
//                           {order.status === "pending" && (
//                             <DropdownMenuItem>
//                               <CheckCircle className="mr-2 h-4 w-4" />
//                               Mark Processing
//                             </DropdownMenuItem>
//                           )}
//                           {order.status === "processing" && (
//                             <DropdownMenuItem>
//                               <Truck className="mr-2 h-4 w-4" />
//                               Mark Shipped
//                             </DropdownMenuItem>
//                           )}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
