/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TabsContent } from "../UI/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";
import { Skeleton } from "../UI/skeleton";
import { formatCurrency } from "@/lib/utils/helpers";
import { useGetPaymentRequestSummaryQuery } from "@/redux/features/vendors/paymentRequest";

function PaymentRequestSummary({
  paymentRequestStats,
}: {
  paymentRequestStats: any;
}) {
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetPaymentRequestSummaryQuery({});

  // Extract data from both sources
  const stats = paymentRequestStats?.attributes || {};
  const summary = summaryData?.data?.attributes || {};

  // Loading state
  if (isSummaryLoading) {
    return (
      <TabsContent value="summary" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="summary" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Status Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Requests</span>
                <span className="font-semibold text-lg">
                  {summary.totalRequests ?? stats.totalRequests ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Requests</span>
                <span className="font-medium text-yellow-600">
                  {stats.pendingRequests ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Approved Requests</span>
                <span className="font-medium text-green-600">
                  {stats.approvedRequests ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Completed Payments
                </span>
                <span className="font-medium text-blue-600">
                  {(stats.totalRequests ?? 0) -
                    (stats.pendingRequests ?? 0) -
                    (stats.approvedRequests ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Net Amount</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(summary.netAmount ?? 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Request</span>
                <span className="font-medium text-purple-600">
                  {formatCurrency(
                    parseFloat(summary.averageRequestAmount ?? "0")
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Available to Request
                </span>
                <span className="font-medium text-green-600">
                  {formatCurrency(
                    summary.availableToRequest ?? stats.availableWithdrawl ?? 0
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-muted-foreground font-medium">
                  Available Withdrawal
                </span>
                <span className="font-semibold text-lg text-blue-600">
                  {formatCurrency(stats.availableWithdrawl ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Request Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalRequests > 0
                  ? Math.round(
                      ((stats.approvedRequests ?? 0) / stats.totalRequests) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Pending Rate</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.totalRequests > 0
                  ? Math.round(
                      ((stats.pendingRequests ?? 0) / stats.totalRequests) * 100
                    )
                  : 0}
                %
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Processed</p>
              <p className="text-2xl font-bold text-blue-600">
                {summary.totalRequests ?? 0}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.availableWithdrawl ?? 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default PaymentRequestSummary;
