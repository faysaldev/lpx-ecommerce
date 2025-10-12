/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import PaymentRequestTable from "@/components/Payments/PaymentRequestTable";
import ProtectedRoute from "@/Provider/ProtectedRoutes";
import PaymentRequestDialog from "@/components/Vendors/PaymentRequest/PaymentRequestDialog";
import {
  useGetPaymeRequestStatsQuery,
  useMyPaymentRequestQuery,
} from "@/redux/features/vendors/paymentRequest";
import PaymentRequestLoader from "@/components/Payments/PaymentRequestLoader";
import PaymentRequstSummy from "@/components/Payments/PaymentRequstSummy";

export default function VendorPaymentRequestsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL
  const page = searchParams?.get("page") || "1";
  const searchQuery = searchParams?.get("search") || "";
  const statusFilter = searchParams?.get("status") || "";
  const sortBy = searchParams?.get("sort") || "latest";

  // Fetch payment requests with all filters
  const {
    data: paymentRequestsData,
    isLoading,
    refetch,
  } = useMyPaymentRequestQuery({
    search: searchQuery,
    page,
    status: statusFilter,
    sort: sortBy,
  });

  console.log(page, statusFilter, sortBy);

  // Fetch stats
  const { data: paymentRequestStats } = useGetPaymeRequestStatsQuery({});

  // Extract data from API response
  const paymentRequests =
    paymentRequestsData?.data?.attributes?.paymentRequests || [];
  const totalCount = paymentRequestsData?.data?.attributes?.totalCount || 0;
  const totalPages = paymentRequestsData?.data?.attributes?.totalPages || 1;
  const currentPage = parseInt(
    paymentRequestsData?.data?.attributes?.currentPage || "1"
  );

  // Update URL with filters
  const updateURL = (updates: {
    page?: string;
    search?: string;
    status?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams?.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    const newUrl = queryString
      ? `/vendor/payment-requests?${queryString}`
      : "/vendor/payment-requests";
    router.push(newUrl, { scroll: false });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage.toString() });
  };
  // Handle status filter
  const handleStatusFilter = (value: string) => {
    updateURL({ status: value, page: "1" });
  };

  // Handle sort
  const handleSort = (value: string) => {
    updateURL({ sort: value, page: "1" });
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
    toast.success("Payment request created successfully");
  };

  // Stats data
  const stats = [
    {
      title: "Total Requests",
      value: paymentRequestStats?.data?.attributes?.totalRequests || 0,
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: paymentRequestStats?.data?.attributes?.pendingRequests || 0,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Approved",
      value: paymentRequestStats?.data?.attributes?.approvedRequests || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Available Balance",
      value: `AED ${
        paymentRequestStats?.data?.attributes?.availableWithdrawl || 0
      }`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  if (isLoading) {
    return <PaymentRequestLoader />;
  }

  return (
    <ProtectedRoute allowedTypes={["seller"]}>
      <PageLayout
        title="Payment Requests"
        description="Manage your payment requests and track payment status"
        breadcrumbs={[
          { label: "Vendor", href: "/vendor/dashboard" },
          { label: "Payment Requests" },
        ]}
      >
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div />
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Payment Request
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content with Tabs */}
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests">Payment Requests</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Payment Requests ({totalCount} total)</CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Status Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            {statusFilter || "All Status"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Filter by Status
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusFilter("")}
                          >
                            All Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusFilter("pending")}
                          >
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusFilter("paid")}
                          >
                            Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusFilter("rejected")}
                          >
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Sort */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {sortBy === "latest" && "Latest"}
                            {sortBy === "lowToHigh" && "Amount: Low to High"}
                            {sortBy === "highToLow" && "Amount: High to Low"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleSort("latest")}
                          >
                            Latest {sortBy === "latest" && "✓"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSort("lowToHigh")}
                          >
                            Amount: Low to High {sortBy === "lowToHigh" && "✓"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSort("highToLow")}
                          >
                            Amount: High to Low {sortBy === "highToLow" && "✓"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Payment Requests Table */}
                  <PaymentRequestTable paymentRequests={paymentRequests} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <PaymentRequstSummy
                paymentRequestStats={paymentRequestStats?.data}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Payment Request Dialog */}
        <PaymentRequestDialog
          handleCreateSuccess={handleCreateSuccess}
          setShowCreateForm={setShowCreateForm}
          showCreateForm={showCreateForm}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}
