/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ArrowUpDown,
  Clock,
  DollarSign,
  Filter,
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { TabsContent } from "@/components/UI/tabs";
import PaymentRequestTable from "@/components/Payments/PaymentRequestTable";
import { getStatusDisplayText } from "@/lib/utils/helpers";
import { PaymentRequestStatus } from "@/lib/payment-request";
import { useState, useEffect } from "react";
import { useSearchAdminPaymentRequestQuery } from "@/redux/features/admin/adminPaymentrequest";

function AdminPaymentRequest({
  handleViewRequest,
}: {
  handleViewRequest: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PaymentRequestStatus | "all"
  >("all");
  const [sortBy, setSortBy] = useState<
    "newestFirst" | "oldestFirst" | "lowToHigh" | "highToLow"
  >("newestFirst");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const {
    data: paymentRequests,
    isLoading,
    refetch,
  } = useSearchAdminPaymentRequestQuery({
    search: searchQuery,
    sortBy,
    page: currentPage,
    limit,
    status: statusFilter === "all" ? "" : statusFilter,
  });

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [searchQuery, statusFilter, sortBy, currentPage, limit, refetch]);

  const handleToggleSort = (
    newSortBy: "newestFirst" | "oldestFirst" | "lowToHigh" | "highToLow"
  ) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleStatusFilter = (status: PaymentRequestStatus | "all") => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getSortDisplayText = (sort: string) => {
    switch (sort) {
      case "newestFirst":
        return "Newest First";
      case "oldestFirst":
        return "Oldest First";
      case "lowToHigh":
        return "Amount: Low to High";
      case "highToLow":
        return "Amount: High to Low";
      default:
        return "Sort";
    }
  };

  // Extract payment requests data from the response
  const paymentRequestsData =
    paymentRequests?.data?.attributes?.paymentRequests || [];
  const totalPages = paymentRequests?.data?.attributes?.totalPages || 1;
  const totalRecords = paymentRequests?.data?.attributes?.totalRecords || 0;

  return (
    <TabsContent value="requests" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Requests ({totalRecords})</CardTitle>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={handleSearch}
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
                  <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilter("pending")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pending Review
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleStatusFilter("paid")}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusFilter("rejected")}
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
                    {getSortDisplayText(sortBy)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleToggleSort("newestFirst")}
                  >
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleSort("oldestFirst")}
                  >
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleSort("lowToHigh")}
                  >
                    Amount: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleToggleSort("highToLow")}
                  >
                    Amount: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <PaymentRequestTable
                paymentRequests={paymentRequestsData}
                onViewDetails={handleViewRequest}
                showVendorColumn={true}
              />
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default AdminPaymentRequest;
