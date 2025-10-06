"use client";

import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { Input } from "@/components/UI/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
// import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import PaymentRequestForm from "@/components/Payments/PaymentRequestForm";
import PaymentRequestTable from "@/components/Payments/PaymentRequestTable";
import { mockVendorOrders } from "@/lib/mockdata";
// import { PaymentRequestMockAPI } from "@/lib/api/mock/payment-requests";
import {
  filterPaymentRequests,
  formatCurrency,
  getPaymentRequestSummary,
  sortPaymentRequests,
} from "@/lib/utils/helpers";
import type {
  PaymentRequest,
  PaymentRequestStatus,
} from "@/lib/payment-request";
import ProtectedRoute from "@/Provider/ProtectedRoutes";
import PaymentRequestDialog from "@/components/Vendors/PaymentRequest/PaymentRequestDialog";

const VENDOR_ID = "vendor-1"; // In a real app, this would come from auth context

export default function VendorPaymentRequestsPage() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PaymentRequestStatus | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadPaymentRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      // const requests = await PaymentRequestMockAPI.getPaymentRequests(
      //   VENDOR_ID
      // );
      // setPaymentRequests(requests);
    } catch (_error) {
      toast.error("Failed to load payment requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load payment requests
  useEffect(() => {
    loadPaymentRequests();
  }, [loadPaymentRequests]);

  // Filter and sort requests
  const filteredAndSortedRequests = sortPaymentRequests(
    filterPaymentRequests(paymentRequests, {
      status: statusFilter,
      searchQuery: searchQuery || undefined,
    }),
    sortBy,
    sortOrder
  );

  // Calculate summary statistics
  const summary = getPaymentRequestSummary(paymentRequests);

  // Get completed orders for creating new requests
  const completedOrders = mockVendorOrders
    .filter((order) => order.status === "completed")
    .map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer,
      total: order.total,
      orderDate: order.orderDate,
      items: order.items,
      hasPaymentRequest: paymentRequests.some((pr) =>
        pr.items.some((item) => item.orderId === order.id)
      ),
    }))
    .filter((order) => !order.hasPaymentRequest); // Only show orders not already in a request

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadPaymentRequests();
    toast.success("Payment request created successfully");
  };

  const handleToggleSort = (newSortBy: "date" | "amount" | "status") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const stats = [
    {
      title: "Total Requests",
      value: summary.totalRequests,
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: summary.statusCounts.pending,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Approved",
      value: summary.statusCounts.approved,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Total Amount",
      value: formatCurrency(summary.totalAmount),
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <PageLayout
        title="Payment Requests"
        description="Manage your payment requests and track payment status"
        breadcrumbs={[
          { label: "Vendor", href: "/vendor/dashboard" },
          { label: "Payment Requests" },
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton loaders with predictable order
              <Card key={`skeleton-${i}`}>
                <CardContent className="p-6">
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
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
            <Button
              onClick={() => setShowCreateForm(true)}
              disabled={completedOrders.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Payment Request
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, _index) => (
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

          {/* Main Content */}
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests">Payment Requests</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Payment Requests ({filteredAndSortedRequests.length})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search requests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-[200px]"
                        />
                      </div>

                      {/* Status Filter */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            {statusFilter === "all"
                              ? "All Status"
                              : statusFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Filter by Status
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("all")}
                          >
                            All Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("pending")}
                          >
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("approved")}
                          >
                            Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("paid")}
                          >
                            Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setStatusFilter("rejected")}
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
                            Sort
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleSort("date")}
                          >
                            Date {sortBy === "date" && `(${sortOrder})`}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleSort("amount")}
                          >
                            Amount {sortBy === "amount" && `(${sortOrder})`}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleSort("status")}
                          >
                            Status {sortBy === "status" && `(${sortOrder})`}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <PaymentRequestTable
                    paymentRequests={filteredAndSortedRequests}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Pending Requests
                        </span>
                        <span className="font-medium">
                          {summary.statusCounts.pending}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Approved Requests
                        </span>
                        <span className="font-medium text-green-600">
                          {summary.statusCounts.approved}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Paid Requests
                        </span>
                        <span className="font-medium text-blue-600">
                          {summary.statusCounts.paid}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Rejected Requests
                        </span>
                        <span className="font-medium text-red-600">
                          {summary.statusCounts.rejected}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Requested
                        </span>
                        <span className="font-medium">
                          {formatCurrency(summary.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Net Amount
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(summary.totalNetAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Average Request
                        </span>
                        <span className="font-medium">
                          {formatCurrency(summary.averageAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Available to Request
                        </span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(
                            completedOrders.reduce(
                              (sum, order) => sum + order.total,
                              0
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentRequests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{request.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.items.length} orders •{" "}
                            {formatCurrency(request.totalAmount)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              request.status === "paid"
                                ? "text-green-600"
                                : request.status === "approved"
                                ? "text-blue-600"
                                : request.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {request.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Payment Request Dialog */}
        <PaymentRequestDialog
          VENDOR_ID={VENDOR_ID}
          handleCreateSuccess={handleCreateSuccess}
          setShowCreateForm={setShowCreateForm}
          showCreateForm={showCreateForm}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}
