/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/UI/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { TabsContent } from "@/components/UI/tabs";
import {
  formatCurrency,
  getStatusBadgeVariant,
  getStatusDisplayText,
} from "@/lib/utils/helpers";
import React from "react";

function AdminPaymentAnalytics({
  stats,
  paymentRequests,
}: {
  stats: any;
  paymentRequests: any;
}) {
  return (
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
                  <span className="text-muted-foreground">Paid Requests</span>
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
                  <span className="text-muted-foreground">Total Requested</span>
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
                        0.15
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
            {paymentRequests.slice(0, 5).map((request: any) => {
              const { variant, className } = getStatusBadgeVariant(
                request.status
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
  );
}

export default AdminPaymentAnalytics;
