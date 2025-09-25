"use client";

import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Ban,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  Star,
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
import adminMockService, {
  type AdminActivity,
  type AdminStats,
} from "@/lib/types/admin-mock";

interface TopVendor {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  rating: number;
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
    approvalsChange: 0,
  });
  const [recentActivity, setRecentActivity] = useState<AdminActivity[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);

  useEffect(() => {
    // Load data from admin mock service
    const platformStats = adminMockService.getPlatformStats();
    const activities = adminMockService.getRecentActivity();
    const vendors = adminMockService.getTopVendors();

    setStats(platformStats);
    setRecentActivity(activities);
    setTopVendors(vendors);
  }, []);

  // Mock system health data
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

  const _getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "error":
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

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
    switch (type) {
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
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.usersChange > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.usersChange}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.usersChange}%</span>
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
          <CardContent>
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
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">
                    {Math.abs(stats.productsChange)}%
                  </span>
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
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalOrders.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{stats.ordersChange}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{stats.revenueChange}%</span>
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
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVendors}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+{stats.vendorsChange}</span>
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
          <CardContent>
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
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">
                    Activity will appear here as users interact with your
                    platform
                  </p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    {getActivityTypeIcon(activity.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
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
                  <TableHead className="text-center">Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendors.length === 0 ? (
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
                  topVendors.map((vendor, _index) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">
                        {vendor.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {vendor.sales}
                      </TableCell>
                      <TableCell className="text-right">
                        ${vendor.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm">{vendor.rating}</span>
                        </div>
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
