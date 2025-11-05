"use client";

import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Progress } from "@/components/UI/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { useAdminDasboardQuery } from "@/redux/features/admin/Dashboard";
import { formatNumber } from "@/lib/utils/helpers";

interface TopVendor {
  _id: string;
  storeName: string;
  totalSales: number;
  revenue?: number;
  rating?: number;
  totalEarnings: number;
}

interface RecentActivity {
  type: string;
  action: string;
  details: string;
  time: string;
}

interface AdminStats {
  totalUsers: number;
  usersChange: number;
  totalProducts: number;
  productsChange: number;
  totalOrders: number;
  ordersChange: number;
  totalRevenue: number;
  revenueChange: number;
  activeVendors: number;
  vendorsChange: number;
  pendingApprovals: number;
  topVendors: TopVendor[];
  recentActivities: RecentActivity[];
  growthStats: {
    usersGrowth: number;
    productsGrowth: number;
    ordersGrowth: number;
    revenueGrowth: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    usersChange: 0,
    totalProducts: 0,
    productsChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalRevenue: 0,
    revenueChange: 0,
    activeVendors: 0,
    vendorsChange: 0,
    pendingApprovals: 0,
    topVendors: [],
    recentActivities: [],
    growthStats: {
      usersGrowth: 0,
      productsGrowth: 0,
      ordersGrowth: 0,
      revenueGrowth: 0,
    },
  });

  const { data, error, isLoading } = useAdminDasboardQuery({});
  useEffect(() => {
    if (data?.data?.attributes) {
      const apiData = data.data.attributes;
      setStats({
        totalUsers: apiData.totalUsers || 0,
        usersChange: apiData.growthStats?.usersGrowth || 0,
        totalProducts: apiData.totalProducts || 0,
        productsChange: apiData.growthStats?.productsGrowth || 0,
        totalOrders: apiData.totalOrders || 0,
        ordersChange: apiData.growthStats?.ordersGrowth || 0,
        totalRevenue: apiData.totalRevenue || 0,
        revenueChange: apiData.growthStats?.revenueGrowth || 0,
        activeVendors: apiData.activeVendors || 0,
        vendorsChange: apiData.vendorsChange || 0,
        pendingApprovals: apiData.pendingApprovals || 0,
        topVendors: apiData.topVendors || [],
        recentActivities: apiData.recentActivities || [],
        growthStats: apiData.growthStats || {
          usersGrowth: 0,
          productsGrowth: 0,
          ordersGrowth: 0,
          revenueGrowth: 0,
        },
      });
    }
  }, [data]);

  // Mock system health data (keeping this as it's not from API)
  const systemHealth = [
    {
      name: "Database",
      status: "operational",
      uptime: 99.9,
    },
    {
      name: "API Gateway",
      status: "operational",
      uptime: 99.8,
    },
    {
      name: "Payment Service",
      status: "operational",
      uptime: 99.5,
    },
    {
      name: "Image CDN",
      status: "degraded",
      uptime: 98.2,
    },
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case "product":
        return <Package className="h-4 w-4 text-green-500" />;
      case "vendor":
        return <Store className="h-4 w-4 text-purple-500" />;
      case "user":
        return <Users className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Error loading dashboard</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your marketplace platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.usersChange > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.usersChange}%</span>
                </>
              ) : stats.usersChange < 0 ? (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.usersChange}%</span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">0%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {stats.totalProducts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.productsChange > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">
                    +{stats.productsChange}%
                  </span>
                </>
              ) : stats.productsChange < 0 ? (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">
                    {Math.abs(stats.productsChange)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">0%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {stats.totalOrders.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.ordersChange > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.ordersChange}%</span>
                </>
              ) : stats.ordersChange < 0 ? (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.ordersChange}%</span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">0%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              AED {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.revenueChange > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">
                    +{stats.revenueChange}%
                  </span>
                </>
              ) : stats.revenueChange < 0 ? (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.revenueChange}%</span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">0%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vendors
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{stats.activeVendors}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.vendorsChange > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.vendorsChange}</span>
                </>
              ) : stats.vendorsChange < 0 ? (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.vendorsChange}</span>
                </>
              ) : (
                <>
                  <span className="text-gray-500">0</span>
                </>
              )}
              <span className="ml-1">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                Requires attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">
                    Activity will appear here as users interact with your
                    platform
                  </p>
                </div>
              ) : (
                stats.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {getActivityTypeIcon(activity.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(activity.time)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Vendors</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/vendors">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No vendors yet</p>
                        <p className="text-sm">
                          Top performing vendors will appear here
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.topVendors.map((vendor) => (
                    <TableRow key={vendor._id}>
                      <TableCell className="font-medium">
                        {vendor.storeName}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center gap-4">
                <div
                  className={`h-2 w-2 rounded-full ${getHealthColor(
                    service.status
                  )}`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{service.name}</p>
                    <Badge
                      variant={
                        service.status === "operational"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <Progress value={service.uptime} className="mt-2 h-1" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {service.uptime}% uptime
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
