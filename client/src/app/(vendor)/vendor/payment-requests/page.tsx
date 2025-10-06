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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import { Input } from "@/components/UI/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import PaymentRequestTable from "@/components/Payments/PaymentRequestTable";
import { mockVendorOrders } from "@/lib/mockdata";
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
import { useMyPaymentRequestQuery } from "@/redux/features/vendors/paymentRequest";
import PaymentRequstSummy from "@/components/Payments/PaymentRequstSummy";

const VENDOR_ID = "vendor-1";

export default function VendorPaymentRequestsPage() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL or use defaults
  const page = parseInt(searchParams?.get("page") || "1");
  const searchQuery = searchParams?.get("search") || "";
  const statusFilter =
    (searchParams?.get("status") as PaymentRequestStatus) || "all";
  const sortBy = searchParams?.get("sort") || "latest";

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { data: paymentRequestsData, refetch } = useMyPaymentRequestQuery({
    page,
    search: searchQuery,
    status: statusFilter === "all" ? "" : statusFilter,
    sort: sortBy,
  });

  // Update URL with current filters and pagination
  const updateURL = (updates: {
    page?: number;
    search?: string;
    status?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.page !== undefined) {
      if (updates.page > 1) params.set("page", updates.page.toString());
      else params.delete("page");
    }

    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search);
      else params.delete("search");
    }

    if (updates.status !== undefined) {
      if (updates.status && updates.status !== "all")
        params.set("status", updates.status);
      else params.delete("status");
    }

    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== "latest")
        params.set("sort", updates.sort);
      else params.delete("sort");
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `/vendor/payment-requests?${queryString}`
      : "/vendor/payment-requests";
    router.push(newUrl, { scroll: false });
  };

  // Handle search
  const handleSearch = (value: string) => {
    updateURL({ search: value, page: 1 });
  };

  // Handle status filter
  const handleStatusFilter = (value: PaymentRequestStatus | "all") => {
    updateURL({ status: value, page: 1 });
  };

  // Handle sort
  const handleSort = (value: string) => {
    updateURL({ sort: value, page: 1 });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
  };

  const loadPaymentRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      await refetch(); // Trigger the query with current URL params
    } catch (_error) {
      toast.error("Failed to load payment requests");
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  // Load payment requests when URL params change
  useEffect(() => {
    loadPaymentRequests();
  }, [loadPaymentRequests, page, searchQuery, statusFilter, sortBy]);

  // Update local state when API data changes
  useEffect(() => {
    // console.log(paymentRequestsData.paymentRequests, "payment Data");
    if (paymentRequestsData) {
      console.log(paymentRequestsData?.data?.attributes?.paymentRequests);
      setPaymentRequests(paymentRequestsData?.paymentRequests || []);
      setTotalPages(paymentRequestsData.totalPages || 1);
      setTotalCount(paymentRequestsData.totalCount || 0);
    }
  }, [paymentRequestsData]);

  // Filter and sort requests (client-side for display, but main filtering is server-side)
  const filteredAndSortedRequests = paymentRequests;

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
    .filter((order) => !order.hasPaymentRequest);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadPaymentRequests();
    toast.success("Payment request created successfully");
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let p = startPage; p <= endPage; p++) {
      buttons.push(
        <Button
          key={p}
          variant={page === p ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  const stats = [
    {
      title: "Total Requests",
      value: totalCount,
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
                    <CardTitle>Payment Requests ({totalCount} total)</CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search requests..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
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
                            onClick={() => handleStatusFilter("all")}
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
                  <PaymentRequestTable
                    paymentRequests={filteredAndSortedRequests}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Showing page {page} of {totalPages} • {totalCount} total
                        requests
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderPaginationButtons()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <PaymentRequstSummy
              completedOrders={completedOrders}
              paymentRequests={paymentRequests}
              summary={summary}
            />
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

// "use client";

// import {
//   ArrowUpDown,
//   CheckCircle,
//   Clock,
//   DollarSign,
//   Filter,
//   Plus,
//   Search,
//   TrendingUp,
// } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";
// import PageLayout from "@/components/layout/PageLayout";
// import { Button } from "@/components/UI/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/UI/dropdown-menu";
// import { Input } from "@/components/UI/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
// import PaymentRequestTable from "@/components/Payments/PaymentRequestTable";
// import { mockVendorOrders } from "@/lib/mockdata";
// import {
//   filterPaymentRequests,
//   formatCurrency,
//   getPaymentRequestSummary,
//   sortPaymentRequests,
// } from "@/lib/utils/helpers";
// import type {
//   PaymentRequest,
//   PaymentRequestStatus,
// } from "@/lib/payment-request";
// import ProtectedRoute from "@/Provider/ProtectedRoutes";
// import PaymentRequestDialog from "@/components/Vendors/PaymentRequest/PaymentRequestDialog";
// import { useMyPaymentRequestQuery } from "@/redux/features/vendors/paymentRequest";
// import PaymentRequstSummy from "@/components/Payments/PaymentRequstSummy";

// const VENDOR_ID = "vendor-1"; // In a real app, this would come from auth context

// export default function VendorPaymentRequestsPage() {
//   const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     PaymentRequestStatus | "all"
//   >("all");
//   const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const { data: paymentRequestsData } = useMyPaymentRequestQuery({
//     page: 1,
//     search: "",
//     sort: "",
//   });
//   console.log(paymentRequestsData?.data?.attributes);

//   const loadPaymentRequests = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       // const requests = await PaymentRequestMockAPI.getPaymentRequests(
//       //   VENDOR_ID
//       // );
//       // setPaymentRequests(requests);
//     } catch (_error) {
//       toast.error("Failed to load payment requests");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Load payment requests
//   useEffect(() => {
//     loadPaymentRequests();
//   }, [loadPaymentRequests]);

//   // Filter and sort requests
//   const filteredAndSortedRequests = sortPaymentRequests(
//     filterPaymentRequests(paymentRequests, {
//       status: statusFilter,
//       searchQuery: searchQuery || undefined,
//     }),
//     sortBy,
//     sortOrder
//   );

//   // Calculate summary statistics
//   const summary = getPaymentRequestSummary(paymentRequests);

//   // Get completed orders for creating new requests
//   const completedOrders = mockVendorOrders
//     .filter((order) => order.status === "completed")
//     .map((order) => ({
//       id: order.id,
//       orderNumber: order.orderNumber,
//       customer: order.customer,
//       total: order.total,
//       orderDate: order.orderDate,
//       items: order.items,
//       hasPaymentRequest: paymentRequests.some((pr) =>
//         pr.items.some((item) => item.orderId === order.id)
//       ),
//     }))
//     .filter((order) => !order.hasPaymentRequest); // Only show orders not already in a request

//   const handleCreateSuccess = () => {
//     setShowCreateForm(false);
//     loadPaymentRequests();
//     toast.success("Payment request created successfully");
//   };

//   const handleToggleSort = (newSortBy: "date" | "amount" | "status") => {
//     if (sortBy === newSortBy) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(newSortBy);
//       setSortOrder("desc");
//     }
//   };

//   const stats = [
//     {
//       title: "Total Requests",
//       value: summary.totalRequests,
//       icon: DollarSign,
//       color: "text-blue-600",
//     },
//     {
//       title: "Pending",
//       value: summary.statusCounts.pending,
//       icon: Clock,
//       color: "text-yellow-600",
//     },
//     {
//       title: "Approved",
//       value: summary.statusCounts.approved,
//       icon: CheckCircle,
//       color: "text-green-600",
//     },
//     {
//       title: "Total Amount",
//       value: formatCurrency(summary.totalAmount),
//       icon: TrendingUp,
//       color: "text-purple-600",
//     },
//   ];

//   if (isLoading) {
//     return (
//       <PageLayout
//         title="Payment Requests"
//         description="Manage your payment requests and track payment status"
//         breadcrumbs={[
//           { label: "Vendor", href: "/vendor/dashboard" },
//           { label: "Payment Requests" },
//         ]}
//       >
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton loaders with predictable order
//               <Card key={`skeleton-${i}`}>
//                 <CardContent className="p-6">
//                   <div className="h-16 bg-muted animate-pulse rounded" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//           <Card>
//             <CardContent className="p-6">
//               <div className="h-64 bg-muted animate-pulse rounded" />
//             </CardContent>
//           </Card>
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <ProtectedRoute allowedTypes={["seller"]}>
//       <PageLayout
//         title="Payment Requests"
//         description="Manage your payment requests and track payment status"
//         breadcrumbs={[
//           { label: "Vendor", href: "/vendor/dashboard" },
//           { label: "Payment Requests" },
//         ]}
//       >
//         <div className="space-y-6">
//           {/* Action Buttons */}
//           <div className="flex justify-between items-center">
//             <div />
//             <Button
//               onClick={() => setShowCreateForm(true)}
//               disabled={completedOrders.length === 0}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               New Payment Request
//             </Button>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {stats.map((stat, _index) => (
//               <Card key={stat.title}>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-muted-foreground">
//                         {stat.title}
//                       </p>
//                       <p className="text-2xl font-bold">{stat.value}</p>
//                     </div>
//                     <stat.icon className={`h-8 w-8 ${stat.color}`} />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Main Content */}
//           <Tabs defaultValue="requests" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="requests">Payment Requests</TabsTrigger>
//               <TabsTrigger value="summary">Summary</TabsTrigger>
//             </TabsList>

//             <TabsContent value="requests" className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <CardTitle>
//                       Payment Requests ({filteredAndSortedRequests.length})
//                     </CardTitle>
//                     <div className="flex items-center gap-2">
//                       {/* Search */}
//                       <div className="relative">
//                         <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           placeholder="Search requests..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           className="pl-8 w-[200px]"
//                         />
//                       </div>

//                       {/* Status Filter */}
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="outline" size="sm">
//                             <Filter className="h-4 w-4 mr-2" />
//                             {statusFilter === "all"
//                               ? "All Status"
//                               : statusFilter}
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>
//                             Filter by Status
//                           </DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("all")}
//                           >
//                             All Status
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("pending")}
//                           >
//                             Pending
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("approved")}
//                           >
//                             Approved
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("paid")}
//                           >
//                             Paid
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => setStatusFilter("rejected")}
//                           >
//                             Rejected
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>

//                       {/* Sort */}
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="outline" size="sm">
//                             <ArrowUpDown className="h-4 w-4 mr-2" />
//                             Sort
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Sort by</DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem
//                             onClick={() => handleToggleSort("date")}
//                           >
//                             Date {sortBy === "date" && `(${sortOrder})`}
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleToggleSort("amount")}
//                           >
//                             Amount {sortBy === "amount" && `(${sortOrder})`}
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleToggleSort("status")}
//                           >
//                             Status {sortBy === "status" && `(${sortOrder})`}
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <PaymentRequestTable
//                     paymentRequests={filteredAndSortedRequests}
//                   />
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <PaymentRequstSummy
//               completedOrders={completedOrders}
//               paymentRequests={paymentRequests}
//               summary={summary}
//             />
//           </Tabs>
//         </div>

//         {/* Create Payment Request Dialog */}
//         <PaymentRequestDialog
//           VENDOR_ID={VENDOR_ID}
//           handleCreateSuccess={handleCreateSuccess}
//           setShowCreateForm={setShowCreateForm}
//           showCreateForm={showCreateForm}
//         />
//       </PageLayout>
//     </ProtectedRoute>
//   );
// }
