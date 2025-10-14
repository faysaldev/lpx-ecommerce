/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  useGetAnalyticsStatsQuery,
  useGetRecentTrendsQuery,
  useGetTopSellingCategoriesQuery,
  useGetTotalProductsQuery,
  useGetTotalRevenueQuery,
  useGetTotalSalesQuery,
  useGetTotalUsersQuery,
} from "@/redux/features/admin/adminAnalysis";
import RevenueTrendsChart from "@/components/Admin/Analytics/RevenueTrendsChart ";
import SalesTrendsChart from "@/components/Admin/Analytics/SalesTrendsChart ";
import UsersTrendsChart from "@/components/Admin/Analytics/UsersTrendsChart ";
import ProductsTrendsChart from "@/components/Admin/Analytics/ProductsTrendsChart ";

export default function AnalyticsDashboard() {
  const { data: analyticsStats } = useGetAnalyticsStatsQuery({});
  const { data: totalSales, isLoading: isLoadingTotalSales } =
    useGetTotalSalesQuery({});
  const { data: totalUsers, isLoading: isLoadingTotalUsers } =
    useGetTotalUsersQuery({});
  const { data: totalProducts, isLoading: isLoadingTotalProducts } =
    useGetTotalProductsQuery({});
  const { data: totalRevenue, isLoading: isLoadingTotalRevenue } =
    useGetTotalRevenueQuery({});
  const {
    data: topSellingCategories,
    isLoading: isLoadingTopSellingCategories,
  } = useGetTopSellingCategoriesQuery({});
  const { data: recentTrends, isLoading: isLoadingRecentTrends } =
    useGetRecentTrendsQuery({});

  // Process data for charts
  const revenueData = totalRevenue?.data?.attributes || [];
  const salesData = totalSales?.data?.attributes || [];
  const usersData = totalUsers?.data?.attributes || [];
  const productsData = totalProducts?.data?.attributes || [];

  // Calculate product count by date for the products chart
  const productCountByDate = productsData.reduce((acc: any, product: any) => {
    const date = product.date;
    if (!acc[date]) {
      acc[date] = { date, productCount: 0, totalSales: 0 };
    }
    acc[date].productCount += 1;
    acc[date].totalSales += product.totalSales;
    return acc;
  }, {});

  const productsChartData = Object.values(productCountByDate);

  if (
    isLoadingTotalSales ||
    isLoadingTotalUsers ||
    isLoadingTotalProducts ||
    isLoadingTotalRevenue ||
    isLoadingTopSellingCategories ||
    isLoadingRecentTrends
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your marketplace performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {analyticsStats?.data?.attributes?.totalRevenue?.count?.toFixed(
                2
              ) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsStats?.data?.attributes?.totalRevenue?.percentage || 0}%
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analyticsStats?.data?.attributes?.totalSales?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsStats?.data?.attributes?.totalSales?.percentage || 0}%
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analyticsStats?.data?.attributes?.activeUsers?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsStats?.data?.attributes?.activeUsers?.percentage || 0}%
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products Listed
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +
              {analyticsStats?.data?.attributes?.totalProductsListed?.count ||
                0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyticsStats?.data?.attributes?.totalProductsListed
                ?.percentage || 0}
              % from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueTrendsChart data={revenueData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesTrendsChart data={salesData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <UsersTrendsChart data={usersData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductsTrendsChart data={productsChartData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(topSellingCategories?.data?.attributes || []).map(
                (category: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{category.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.totalSales} sales
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentTrends?.data?.attributes || []).map(
                (trend: any, index: number) => {
                  const getIconAndColor = (name: string) => {
                    if (name.includes("Active Users"))
                      return { icon: Users, color: "text-green-600" };
                    if (name.includes("Popular Products"))
                      return { icon: TrendingUp, color: "text-blue-600" };
                    if (name.includes("Cart"))
                      return { icon: ShoppingCart, color: "text-yellow-600" };
                    if (name.includes("Wishlist"))
                      return { icon: Package, color: "text-purple-600" };
                    return { icon: TrendingUp, color: "text-gray-600" };
                  };

                  const { icon: Icon, color } = getIconAndColor(trend.name);

                  return (
                    <div
                      key={`${trend.name}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <Icon className={`h-4 w-4 ${color}`} />
                      <div>
                        <p className="text-sm font-medium">{trend.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Count: {trend.count} •{" "}
                          {new Date(trend.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
