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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
// import { useWishlist } from "@/context/WishlistContext";

function DashboardContent() {
  const wishlistCount = 5;

  const stats = [
    {
      label: "Total Orders",
      value: 3,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: Heart,
      color: "text-red-600",
    },
    {
      label: "Reviews Written",
      value: 5,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      label: "Member Since",
      value: "Jan 2024",
      icon: Clock,
      color: "text-green-600",
    },
  ];

  const recentOrders = [
    {
      id: "1",
      date: "2024-01-15",
      total: 299.99,
      status: "delivered",
      items: 2,
    },
    {
      id: "2",
      date: "2024-01-10",
      total: 599.99,
      status: "shipped",
      items: 1,
    },
    {
      id: "3",
      date: "2024-01-05",
      total: 149.99,
      status: "processing",
      items: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
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
                  <p className="text-2xl font-bold">{stat.value}</p>
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
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} •{" "}
                        {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total}</p>
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
  return <DashboardContent />;
}
