/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { TabsContent } from "@/components/UI/tabs";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";
import { useAdminPaymentVendorSummeriesQuery } from "@/redux/features/admin/adminPaymentrequest";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/UI/button";

function PaymentVendorAnalysis() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const { data: vendorSummeries, isLoading } =
    useAdminPaymentVendorSummeriesQuery({
      page: currentPage,
      limit: limit,
    });

  // Extract data from API response
  const vendorSummariesData =
    vendorSummeries?.data?.attributes?.vendorSummaries || [];
  const totalPages = vendorSummeries?.data?.attributes?.totalPages || 1;
  const totalVendors = vendorSummeries?.data?.attributes?.totalVendors || 0;
  const currentPageFromApi =
    vendorSummeries?.data?.attributes?.currentPage || 1;

  console.log("Vendor Summaries:", vendorSummeries?.data);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <TabsContent value="vendors" className="space-y-6">
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="vendors" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Payment Summaries ({totalVendors})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Total Withdrawal</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Pending Amount</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorSummariesData.length > 0 ? (
                  vendorSummariesData.map((vendor: any) => (
                    <TableRow key={vendor.vendorId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium block">
                              {vendor.storeName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {vendor.vendorId}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(vendor.totalEarnings)}
                      </TableCell>
                      <TableCell className="text-blue-600 font-medium">
                        {formatCurrency(vendor.totalWithdrawal)}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {formatCurrency(vendor.totalPaidAmount)}
                      </TableCell>
                      <TableCell className="text-yellow-600 font-medium">
                        {formatCurrency(vendor.totalPendingAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        {vendor.totalOrders}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(vendor.avgOrderValue)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {vendor.lastPayment
                          ? formatDate(vendor.lastPayment, {
                              hour: undefined,
                              minute: undefined,
                            })
                          : "No payments yet"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No vendor data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing page {currentPageFromApi} of {totalPages} •{" "}
                {totalVendors} vendors total
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
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
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
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default PaymentVendorAnalysis;
