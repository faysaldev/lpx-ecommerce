/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { DollarSign, Eye, Package, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

function QuickActionOverview({
  dashboard,
  setActiveTab,
}: {
  setActiveTab: any;
  dashboard: any;
}) {
  return (
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
              <p className="text-sm text-muted-foreground">No recent orders</p>
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
                    <p className="font-medium text-sm">AED {order.total}</p>
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
  );
}

export default QuickActionOverview;
