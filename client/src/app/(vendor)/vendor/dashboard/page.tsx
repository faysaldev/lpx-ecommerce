/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  BarChart3,
  DollarSign,
  Eye,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { StatsOverview } from "@/components/Vendors/VendorDashboard/Overview/StatsOverview";
import RecentOrderOverview from "@/components/Vendors/VendorDashboard/Overview/RecentOrderOverview";
import QuickActionOverview from "@/components/Vendors/VendorDashboard/Overview/QuickActionOverview";
import { OrdersTable } from "@/components/Vendors/VendorDashboard/Order/OrdersTable";
import AnalysisSection from "@/components/Vendors/VendorDashboard/Analysis/AnalysisSection";
import VendorProductSection from "@/components/Vendors/VendorDashboard/Products/VendorProductSection";
import { SortOption } from "@/lib/browse-utils";
import {
  useVendorDashboardOverviewQuery,
  useVendorToSellingQuery,
} from "@/redux/features/vendors/VendorDashboard";

type ProductStatus = "all" | "active" | "draft" | "sold" | "out_of_stock";

const VendorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

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

  // Filter and sort products
  // useEffect(() => {
  //   let filtered = [...products];

  //   // Apply status filter
  //   if (statusFilter !== "all") {
  //     if (statusFilter === "out_of_stock") {
  //       filtered = filtered.filter(
  //         (p) => p.stock === 0 && p.status === "active"
  //       );
  //     } else {
  //       filtered = filtered.filter((p) => p.status === statusFilter);
  //     }
  //   }

  //   // Apply search filter
  //   if (searchQuery) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(
  //       (p) =>
  //         p.name.toLowerCase().includes(query) ||
  //         p.description.toLowerCase().includes(query) ||
  //         p.category.toLowerCase().includes(query)
  //     );
  //   }

  //   // Apply sorting
  //   switch (sortOption) {
  //     case "price-asc":
  //       filtered.sort((a, b) => a.price - b.price);
  //       break;
  //     case "price-desc":
  //       filtered.sort((a, b) => b.price - a.price);
  //       break;
  //     case "name-asc":
  //       filtered.sort((a, b) => a.name.localeCompare(b.name));
  //       break;
  //     default:
  //       filtered.sort(
  //         (a, b) =>
  //           new Date(b.dateCreated || 0).getTime() -
  //           new Date(a.dateCreated || 0).getTime()
  //       );
  //       break;
  //   }
  // }, [products, statusFilter, searchQuery, sortOption]);

  const { data: VendorDashboardStats } = useVendorDashboardOverviewQuery({});

  const AllStats = VendorDashboardStats?.data?.stats;
  const AllRecentOrders = VendorDashboardStats?.data?.recentOrders;

  const { data: vendorTopSelling } = useVendorToSellingQuery({});
  const allTopSelling = vendorTopSelling?.data?.attributes;
  console.log("top selling page data show", allTopSelling);

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
          <StatsOverview AllStats={AllStats} />

          {/* Quick Actions */}
          <QuickActionOverview
            AllStats={AllStats}
            AllRecentOrders={AllRecentOrders}
            setActiveTab={setActiveTab}
          />
          {/* Recent Orders Full Width */}
          <RecentOrderOverview allTopSelling={allTopSelling} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TODO: products section */}
        <VendorProductSection />

        <TabsContent value="analytics" className="space-y-6">
          <AnalysisSection />
        </TabsContent>
      </Tabs>
    </PageLayout>
    // </ProtectedRoute>
  );
};

export default VendorDashboardPage;
