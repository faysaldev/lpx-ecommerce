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
import {
  useVendorDashboardOverviewQuery,
  useVendorToSellingQuery,
} from "@/redux/features/vendors/VendorDashboard";
import { useVendorGetsQuery } from "@/redux/features/vendors/vendor";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSelectedVendor,
  setVendorDetails,
} from "@/redux/features/Common/CommonSlice";

const VendorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: VendorDashboardStats } = useVendorDashboardOverviewQuery({});

  const AllStats = VendorDashboardStats?.data?.stats;
  const AllRecentOrders = VendorDashboardStats?.data?.recentOrders;

  const { data: vendorTopSelling } = useVendorToSellingQuery({});
  const allTopSelling = vendorTopSelling?.data?.attributes;
  const { data: getVendorData } = useVendorGetsQuery({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      getVendorData?.data?.attributes &&
      getVendorData?.data?.attributes.length > 0
    ) {
      // Extract the first item (index 0) from the attributes array
      const vendor = getVendorData.data.attributes[0];

      // Map the data to the VendorOwnerDetails interface

      // Dispatch the vendor details to the store
      dispatch(
        setVendorDetails({
          vendorId: vendor._id,
          vendorName: vendor.storeName,
          sellerId: vendor.seller,
        })
      );
    }
  }, [getVendorData, dispatch]);
  const vendor = useAppSelector(selectSelectedVendor);

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
            <span>AED </span>
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
          <Link href={`/vendor/${vendor?.vendorId}`}>
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
