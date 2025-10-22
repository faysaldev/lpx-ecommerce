/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TabsContent } from "../UI/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";
import { formatCurrency } from "@/lib/utils/helpers";

function PaymentRequestSummary({
  paymentRequestStats,
}: {
  paymentRequestStats: any;
}) {
  const stats = paymentRequestStats?.attributes || {}; // Ensure we use the correct data from props

  console.log(paymentRequestStats, "summery page stats");

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
                  {stats.totalRequests ?? 0}
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
                  {stats.totalRequests -
                    (stats.pendingRequests ?? 0) -
                    (stats.approvedRequests ?? 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-md">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">
              {stats.totalRequests > 0
                ? Math.round(
                    ((stats.approvedRequests ?? 0) / stats.totalRequests) * 100
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
              {stats.totalRequests ?? 0}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.availableWithdrawl ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

export default PaymentRequestSummary;
