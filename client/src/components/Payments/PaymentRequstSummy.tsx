/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TabsContent } from "../UI/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";
import { formatCurrency } from "@/lib/utils/helpers";

function PaymentRequstSummy({
  paymentRequests,
  summary,
  completedOrders,
}: {
  paymentRequests: any;
  summary: any;
  completedOrders: any;
}) {
  return (
    <TabsContent value="summary" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Requests</span>
                <span className="font-medium">
                  {summary.statusCounts.pending}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Approved Requests</span>
                <span className="font-medium text-green-600">
                  {summary.statusCounts.approved}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid Requests</span>
                <span className="font-medium text-blue-600">
                  {summary.statusCounts.paid}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rejected Requests</span>
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
                <span className="text-muted-foreground">Total Requested</span>
                <span className="font-medium">
                  {formatCurrency(summary.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Amount</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(summary.totalNetAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Request</span>
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
                      (sum: any, order: any) => sum + order.total,
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
            {paymentRequests.slice(0, 5).map((request: any) => (
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
  );
}

export default PaymentRequstSummy;
