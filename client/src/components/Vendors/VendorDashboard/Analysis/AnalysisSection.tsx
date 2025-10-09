/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { useVendorAnalyticsQuery } from "@/redux/features/vendors/VendorDashboard";
import { BarChart3, TrendingUp } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Colors for the pie chart
const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

function AnalysisSection() {
  const { data, isLoading } = useVendorAnalyticsQuery({});
  console.log("useVendorAnalyticsQuery", data);

  const performance = data?.data?.attributes?.performanceMetrics;
  const revenueData = data?.data?.attributes?.revenueTrends;

  // Prepare data for pie chart
  const pieChartData = performance
    ? [
        {
          name: "Vendor Ratings",
          value: performance.vendorRatingsCount ?? 0,
        },
        {
          name: "Product Ratings",
          value: performance.productRatingsCount ?? 0,
        },
        {
          name: "Completed Orders",
          value: performance.completedOrdersCount ?? 0,
        },
      ]
    : [];

  // Custom label renderer for the pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ---------- Performance Metrics ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Store analytics</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : performance &&
            pieChartData.some((item) => item.value > 0) ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) =>
                      `${value}: ${entry.payload.value}`
                    }
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Analytics will show when you have data</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---------- Revenue Trends ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Daily revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData && revenueData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Revenue data will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalysisSection;