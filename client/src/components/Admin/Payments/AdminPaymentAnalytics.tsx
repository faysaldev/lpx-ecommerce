/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/UI/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { TabsContent } from "@/components/UI/tabs";
import {
  formatCurrency,
  getStatusBadgeVariant,
  getStatusDisplayText,
  formatDate,
} from "@/lib/utils/helpers";
import { useAdminPayRequestAnalysisQuery } from "@/redux/features/admin/adminPaymentrequest";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

function AdminPaymentAnalytics() {
  const { data: payRequestAnalytics, isLoading } =
    useAdminPayRequestAnalysisQuery({});
  // Extract data from API response
  const analyticsData = payRequestAnalytics?.data?.attributes;
  const paymentStatusDistribution =
    analyticsData?.paymentStatusDistribution || [];
  const financialOverview = analyticsData?.financialOverview || {
    paid: 0,
    pending: 0,
    rejected: 0,
  };
  const recentPaymentActivity = analyticsData?.recentPaymentActivity || [];

  // Prepare data for pie chart
  const pieChartData = paymentStatusDistribution.map((item: any) => ({
    name: getStatusDisplayText(item._id),
    value: item.count,
    status: item._id,
  }));

  // Colors for pie chart
  const COLORS = {
    pending: "#f59e0b", // yellow
    paid: "#10b981", // green
    rejected: "#ef4444", // red
    approved: "#3b82f6", // blue
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardContent className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="analytics" className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialOverview.paid)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(financialOverview.pending)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(financialOverview.rejected)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Declined requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentStatusDistribution.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent as number) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry: any, index: any) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[entry.status as keyof typeof COLORS] ||
                            "#6b7280"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No payment data available
              </div>
            )}

            {/* Status Distribution Details */}
            <div className="space-y-3 mt-4">
              {paymentStatusDistribution.map((item: any) => {
                const { variant, className } = getStatusBadgeVariant(item._id);
                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={variant} className={className}>
                        {getStatusDisplayText(item._id)}
                      </Badge>
                    </div>
                    <span className="font-medium">{item.count} requests</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Total Amount Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Amount Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">
                      Paid Amount
                    </span>
                    <span className="font-bold text-green-800">
                      {formatCurrency(financialOverview.paid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">
                      Pending Amount
                    </span>
                    <span className="font-bold text-yellow-800">
                      {formatCurrency(financialOverview.pending)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-800">
                      Rejected Amount
                    </span>
                    <span className="font-bold text-red-800">
                      {formatCurrency(financialOverview.rejected)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-800 text-lg">
                      {paymentStatusDistribution.reduce(
                        (total: number, item: any) => total + item.count,
                        0
                      )}
                    </div>
                    <div className="text-blue-600">Total Requests</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-bold text-purple-800 text-lg">
                      {formatCurrency(
                        financialOverview.paid +
                          financialOverview.pending +
                          financialOverview.rejected
                      )}
                    </div>
                    <div className="text-purple-600">Total Amount</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payment Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPaymentActivity.length > 0 ? (
              recentPaymentActivity.map((request: any) => {
                const { variant, className } = getStatusBadgeVariant(
                  request.status
                );
                return (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">Withdrawal Request</p>
                          <Badge variant={variant} className={className}>
                            {getStatusDisplayText(request.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Bank: {request.bankName} • {request.accountType}
                          </p>
                          <p>
                            Account: {request.accountNumber} • Phone:{" "}
                            {request.phoneNumber}
                          </p>
                          <p>Requested: {formatDate(request.requestDate)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCurrency(request.withdrawalAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {request._id}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent payment activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default AdminPaymentAnalytics;
