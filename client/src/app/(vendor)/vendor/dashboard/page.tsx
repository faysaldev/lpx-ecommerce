/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// Types for dashboard data
interface Customer {
  name: string;
  avatar: string;
}

interface Order {
  id: string;
  customer: Customer;
  total: number;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  status: string;
  price: number;
  images?: string[];
  quantity?: number;
  sales: number;
}

interface Analytics {
  revenue: {
    thisMonth: number;
  };
  orders: {
    total: number;
  };
  products: {
    active: number;
  };
  customers: {
    total: number;
  };
}

interface Dashboard {
  analytics: Analytics;
  recentOrders: Order[];
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

import {
  ArrowUpDown,
  BarChart3,
  Copy,
  DollarSign,
  Edit2,
  Eye,
  MoreVertical,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
// import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

import { SORT_OPTIONS, type SortOption } from "@/lib/browse-utils";
import {
  mockVendorAnalytics,
  mockVendorOrders,
  mockVendorProducts,
} from "@/lib/mockdata";

const initialDashboardData = {
  analytics: mockVendorAnalytics,
  recentOrders: mockVendorOrders.slice(0, 5).map((order: any) => ({
    ...order,
    createdAt: order.orderDate,
    updatedAt: order.orderDate,
    orderNumber: order.orderNumber,
  })), // Get the 5 most recent orders
  topProducts: mockVendorAnalytics.topProducts,
  messages: [],
};

type ProductStatus = "all" | "active" | "draft" | "sold" | "out_of_stock";

function StatsOverview({ dashboard }: { dashboard: Dashboard }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Revenue */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(dashboard.analytics.revenue.thisMonth)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Orders
              </p>
              <p className="text-2xl font-bold">
                {dashboard.analytics.orders.total}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Products
              </p>
              <p className="text-2xl font-bold">
                {dashboard.analytics.products.active}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      {/* Customers */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Customers
              </p>
              <p className="text-2xl font-bold">
                {dashboard.analytics.customers.total}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductTable({
  products,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
}: {
  products: Product[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "sold":
        return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto bg-muted rounded-full flex items-center justify-center mb-6 w-24 h-24">
          <Package className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="font-semibold mb-2 text-xl">No products found</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          You haven{`'`}t created any products yet. Start by adding your first
          product to your store.
        </p>
        <Button asChild>
          <Link href="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Product
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    ID: {product.id}
                  </p>
                </div>
              </TableCell>
              <TableCell>N/A</TableCell>
              <TableCell className="font-medium">${product.price}</TableCell>
              <TableCell>0</TableCell>
              <TableCell>{getStatusBadge("open")}</TableCell>
              <TableCell>0</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(product.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(product.id)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(product.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto bg-muted rounded-full flex items-center justify-center mb-6 w-24 h-24">
          <ShoppingCart className="text-muted-foreground h-12 w-12" />
        </div>
        <h3 className="font-semibold mb-2 text-xl">No orders found</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your orders will appear here once customers start purchasing from your
          store.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={order.customer.avatar}
                    alt={order.customer.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">Order Items</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    Order Details
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState(mockVendorProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockVendorProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const dashboard = initialDashboardData;

  // Calculate stats from products (already provided by mockVendorAnalytics)
  const productStats = {
    total: products.length,
    active: products.filter((p: any) => p.status === "active").length,
    draft: products.filter((p: any) => p.status === "draft").length,
    sold: products.filter((p: any) => p.status === "sold").length,
    outOfStock: products.filter(
      (p: any) => p.stock === 0 && p.status === "active"
    ).length,
  };

  // Update dashboard analytics with real product stats
  dashboard.analytics.products = productStats;

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "out_of_stock") {
        filtered = filtered.filter(
          (p) => p.stock === 0 && p.status === "active"
        );
      } else {
        filtered = filtered.filter((p) => p.status === statusFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.dateCreated || 0).getTime() -
            new Date(a.dateCreated || 0).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [products, statusFilter, searchQuery, sortOption]);

  const handleEdit = (productId: string) => {
    router.push(`/vendor/products/${productId}/edit`);
  };

  const handleView = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleDuplicate = (productId: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      const duplicated = {
        ...product,
        id: `${productId}-copy-${Date.now()}`,
        name: `${product.name} (Copy)`,
        status: "draft" as const,
        views: 0,
        wishlistCount: 0,
        dateCreated: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setProducts([duplicated, ...products]);
      toast.success("Product duplicated successfully");
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p: any) => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  return (
    // <ProtectedRoute>
    <PageLayout
      title="Vendor Dashboard"
      description="Welcome back! Here's what's happening with your store today."
      breadcrumbs={[{ label: "Vendor" }, { label: "Dashboard" }]}
    >
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <Button variant="outline" asChild>
          <Link href="/vendor/payment-requests">
            <DollarSign className="h-4 w-4 mr-2" />
            Payment Requests
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/vendor/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
        <Button asChild>
          <Link href="/vendor/1">
            <Eye className="h-4 w-4 mr-2" />
            View Store
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsOverview dashboard={dashboard} />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/vendor/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/vendor/payment-requests">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Payment Requests
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("products")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/vendor/1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Store
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store Status</CardTitle>
                <CardDescription>Your store health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Store Status</span>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Products</span>
                    <span>{dashboard.analytics.products.active} active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orders</span>
                    <span>{dashboard.analytics.orders.total} total</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      No recent orders
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboard.recentOrders.slice(0, 3).map((order: Order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={order.customer.avatar}
                            alt={order.customer.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {order.customer.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            AED {order.total}
                          </p>
                          <Badge
                            className={
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => setActiveTab("orders")}
                    >
                      View All Orders
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Full Width */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Your best performing products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboard.topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No sales data yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboard.topProducts.map((product: any, index: number) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          AED {product.revenue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable orders={dashboard.recentOrders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage your inventory</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/vendor/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-10"
                  />
                </div>

                {/* Sort and Status Filter */}
                <div className="flex items-center gap-3">
                  {/* Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[120px] justify-start"
                      >
                        {statusFilter === "all"
                          ? "All Products"
                          : statusFilter === "out_of_stock"
                          ? "Out of Stock"
                          : statusFilter.charAt(0).toUpperCase() +
                            statusFilter.slice(1)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Products
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("active")}
                      >
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("draft")}
                      >
                        Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("sold")}>
                        Sold
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("out_of_stock")}
                      >
                        Out of Stock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sort */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="min-w-[140px] justify-start"
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        {
                          SORT_OPTIONS.find((o) => o.value === sortOption)
                            ?.label
                        }
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {SORT_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() =>
                            setSortOption(option.value as SortOption)
                          }
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || statusFilter !== "all") && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Filters:
                  </span>
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Search: {searchQuery}
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Status:{" "}
                      {statusFilter === "out_of_stock"
                        ? "Out of Stock"
                        : statusFilter}
                      <button
                        type="button"
                        onClick={() => setStatusFilter("all")}
                        className="hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Product Table */}
              <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onView={handleView}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Store analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Analytics will show when you have data</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Revenue data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
    // </ProtectedRoute>
  );
}
