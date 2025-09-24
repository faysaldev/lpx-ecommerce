"use client";

import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentApprovalDialog from "@/features/payments/components/PaymentApprovalDialog";
import PaymentRequestTable from "@/features/payments/components/PaymentRequestTable";
import { PaymentRequestMockAPI } from "@/lib/api/mock/payment-requests";
import {
  filterPaymentRequests,
  formatCurrency,
  formatDate,
  getStatusBadgeVariant,
  getStatusDisplayText,
  sortPaymentRequests,
} from "@/lib/payment-request-utils";
import type {
  PaymentRequest,
  PaymentRequestStats,
  PaymentRequestStatus,
  VendorPaymentSummary,
} from "@/types/payment-request";

export default function AdminPaymentManagementPage() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [vendorSummaries, setVendorSummaries] = useState<
    VendorPaymentSummary[]
  >([]);
  const [stats, setStats] = useState<PaymentRequestStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PaymentRequestStatus | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "vendor">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null,
  );
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [requests, summaries, statistics] = await Promise.all([
        PaymentRequestMockAPI.getPaymentRequests(),
        PaymentRequestMockAPI.getVendorSummaries(),
        PaymentRequestMockAPI.getStats(),
      ]);

      setPaymentRequests(requests);
      setVendorSummaries(summaries);
      setStats(statistics);
    } catch (_error) {
      toast.error("Failed to load payment data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load all data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter and sort requests
  const filteredAndSortedRequests = sortPaymentRequests(
    filterPaymentRequests(paymentRequests, {
      status: statusFilter,
      searchQuery: searchQuery || undefined,
    }),
    sortBy,
    sortOrder,
  );

  const handleViewRequest = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowApprovalDialog(true);
  };

  const handleApprovalUpdate = () => {
    setShowApprovalDialog(false);
    setSelectedRequest(null);
    loadData(); // Reload data after update
  };

  const handleToggleSort = (newSortBy: "date" | "amount" | "vendor") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const handleExportData = () => {
    toast.info("Export functionality", {
      description: "Export feature would be implemented here",
    });
  };

  const dashboardStats = stats
    ? [
        {
          title: "Total Requests",
          value: stats.totalRequests,
          icon: CreditCard,
          color: "text-blue-600",
        },
        {
          title: "Pending Review",
          value: stats.pendingRequests,
          icon: Clock,
          color: "text-yellow-600",
        },
        {
          title: "Approved",
          value: stats.approvedRequests,
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          title: "Total Amount",
          value: formatCurrency(stats.totalAmount),
          icon: DollarSign,
          color: "text-purple-600",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Payment Management
            </h1>
            <p className="text-muted-foreground">
              Manage vendor payment requests and process payments
            </p>
          </div>
        </div>

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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Manage vendor payment requests and process payments
          </p>
        </div>
        <Button variant="outline" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, _index) => (
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Payment Requests</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Summaries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                          : getStatusDisplayText(statusFilter)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("pending")}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Pending Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("approved")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("paid")}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("rejected")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
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
                        onClick={() => handleToggleSort("vendor")}
                      >
                        Vendor {sortBy === "vendor" && `(${sortOrder})`}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PaymentRequestTable
                paymentRequests={filteredAndSortedRequests}
                onViewDetails={handleViewRequest}
                showVendorColumn={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payment Summaries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Total Earnings</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Pending Amount</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Avg Order Value</TableHead>
                      <TableHead>Last Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorSummaries.map((vendor) => (
                      <TableRow key={vendor.vendorId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {vendor.vendorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(vendor.totalEarnings)}
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">
                          {formatCurrency(vendor.paidAmount)}
                        </TableCell>
                        <TableCell className="text-yellow-600 font-medium">
                          {formatCurrency(vendor.pendingAmount)}
                        </TableCell>
                        <TableCell>{vendor.totalOrders}</TableCell>
                        <TableCell>
                          {formatCurrency(vendor.averageOrderValue)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {vendor.lastPaymentDate
                            ? formatDate(vendor.lastPaymentDate, {
                                hour: undefined,
                                minute: undefined,
                              })
                            : "No payments yet"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Pending Requests
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          {stats.pendingRequests}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatCurrency(stats.pendingAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Approved Requests
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {stats.approvedRequests}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatCurrency(stats.pendingAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Paid Requests
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {stats.paidRequests}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatCurrency(stats.paidAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Rejected Requests
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          {stats.rejectedRequests}
                        </Badge>
                        <span className="text-sm font-medium">-</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Requested
                      </span>
                      <span className="font-medium">
                        {formatCurrency(stats.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Pending Payments
                      </span>
                      <span className="font-medium text-yellow-600">
                        {formatCurrency(stats.pendingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Completed Payments
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(stats.paidAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Platform Commission
                      </span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(
                          (stats.totalAmount -
                            stats.paidAmount -
                            stats.pendingAmount) *
                            0.15,
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentRequests.slice(0, 5).map((request) => {
                  const { variant, className } = getStatusBadgeVariant(
                    request.status,
                  );
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{request.vendorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.id} • {request.items.length} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(request.netAmount)}
                        </p>
                        <Badge variant={variant} className={className}>
                          {getStatusDisplayText(request.status)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Approval Dialog */}
      <PaymentApprovalDialog
        paymentRequest={selectedRequest}
        isOpen={showApprovalDialog}
        onClose={() => {
          setShowApprovalDialog(false);
          setSelectedRequest(null);
        }}
        onUpdate={handleApprovalUpdate}
      />
    </div>
  );
}
