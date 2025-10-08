/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { EmptyStates } from "@/components/shared/EmptyState";

import { Button } from "@/components/UI/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { useAllUserOrdersQuery } from "@/redux/features/Orders/Orders";
import OrderCard from "@/components/Orders/OrderCard";
import OrderLoader from "@/components/Orders/OrderLoader";
import { ChevronDown } from "lucide-react";

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newestFirst");

  // Transform frontend sortBy to backend sortBy
  const getBackendSortBy = (sortOption: string): string => {
    switch (sortOption) {
      case "newestFirst":
        return "newestFirst";
      case "oldestFirst":
        return "oldestFirst";
      case "highToLow":
        return "highToLow";
      case "lowToHigh":
        return "lowToHigh";
      default:
        return "newest";
    }
  };

  // Transform frontend status to backend status
  const getBackendStatus = (status: string): string => {
    if (status === "all") return "";
    return status;
  };

  // Fetch orders with filters
  const { data: ordersData, isLoading } = useAllUserOrdersQuery({
    status: getBackendStatus(filterStatus),
    sortBy: getBackendSortBy(sortBy),
    page: 1,
    limit: 50,
  });

  // Extract orders from API response
  const orders = ordersData?.data?.attributes?.orders || [];
  const totalOrders = ordersData?.data?.attributes?.totalOrders || 0;

  const handleReorder = (order: any) => {
    toast.info("Reorder functionality is not yet implemented");
  };

  // Count orders by status for filter tabs
  const getOrderCountByStatus = (status: string) => {
    if (status === "all") return totalOrders;
    return orders.filter((order: any) => order.status === status).length;
  };

  if (isLoading) {
    return <OrderLoader />;
  }

  return (
    <PageLayout
      title="Order History"
      description="View and manage your past orders"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Order History" },
      ]}
    >
      {/* Header Actions */}
      <div className="flex justify-end -mt-16 mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[140px] justify-between">
              {sortBy === "newestFirst" && "Newest First"}
              {sortBy === "oldestFirst" && "Oldest First"}
              {sortBy === "highToLow" && "Highest Value"}
              {sortBy === "lowToHigh" && "Lowest Value"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[140px]">
            <DropdownMenuItem onClick={() => setSortBy("newestFirst")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldestFirst")}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("highToLow")}>
              Highest Value
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("lowToHigh")}>
              Lowest Value
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <Tabs
        value={filterStatus}
        onValueChange={setFilterStatus}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="all">
            All Orders ({getOrderCountByStatus("all")})
          </TabsTrigger>
          <TabsTrigger value="conformed">
            Conformed ({getOrderCountByStatus("conformed")})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped ({getOrderCountByStatus("shipped")})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({getOrderCountByStatus("delivered")})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({getOrderCountByStatus("cancelled")})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {orders.length === 0 ? (
        <EmptyStates.NoOrders />
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <OrderCard
              key={order._id}
              order={order}
              onReorder={handleReorder}
            />
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {orders.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {orders.length} of {totalOrders} orders
        </div>
      )}
    </PageLayout>
  );
}
