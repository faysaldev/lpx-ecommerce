/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowRight,
  Clock,
  CreditCard,
  Heart,
  Settings,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { Avatar, AvatarFallback } from "@/components/UI/avatar";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import ProtectedRoute from "@/Provider/ProtectedRoutes";
import { useDashBoardStatiticsQuery } from "@/redux/features/Orders/Orders";

function DashboardContent() {
  const { data, isLoading } = useDashBoardStatiticsQuery({});
  const allData = data?.data;

  // Use backend data if available, otherwise show loading state
  const stats = [
    {
      label: "Total Orders",
      value: allData?.stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: allData?.stats?.totalWishlistItems || 0,
      icon: Heart,
      color: "text-red-600",
    },
    {
      label: "Reviews Written",
      value: allData?.stats?.totalReviews || 0,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      label: "Member Since",
      value: allData?.stats?.joinedAt
        ? new Date(allData.stats.joinedAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "N/A",
      icon: Clock,
      color: "text-green-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Dashboard" }]}>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Manage your orders, wishlist, and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Track and manage your recent purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-4">
                  Loading orders...
                </p>
              ) : allData?.recentOrders && allData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {allData.recentOrders.map((order: any, index: number) => (
                    <div
                      key={order.orderMongoId}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Order #{index}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.price}</p>
                        <Badge
                          className={getStatusColor(order.status)}
                          variant="secondary"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No orders found
                </p>
              )}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/orders">
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  My Wishlist
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/payment-methods">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/settings?tab=addresses">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping Addresses
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedTypes={["customer", "admin", "seller"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
