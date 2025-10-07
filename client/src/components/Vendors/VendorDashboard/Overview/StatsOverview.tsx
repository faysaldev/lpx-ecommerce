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

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import { Card, CardContent } from "@/components/UI/card";

export function StatsOverview({ dashboard }: { dashboard: Dashboard }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // const { data: VendorDashboardStats };

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
