/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/UI/chart";
import { useMemo } from "react";

interface SalesData {
  date: string;
  conformSales: number;
  deliveredSales: number;
  cancelledSales: number;
  shippedSales: number;
}

interface SalesTrendsChartProps {
  data: SalesData[];
}

const SalesTrendsChart = ({ data }: SalesTrendsChartProps) => {
  console.log(data, "Sales Trends Chart");

  // ✅ Normalize field names dynamically for consistency
  const salesData = useMemo(
    () =>
      data.map((item) => ({
        date: item.date,
        confirmed: item.conformSales || 0,
        delivered: item.deliveredSales || 0,
        shipped: item.shippedSales || 0,
        cancelled: item.cancelledSales || 0,
      })),
    [data]
  );

  // ✅ Chart configuration with colors
  const chartConfig = {
    confirmed: {
      label: "Confirmed",
      color: "hsl(189, 94%, 43%)", // cyan
    },
    delivered: {
      label: "Delivered",
      color: "hsl(271, 91%, 65%)", // violet
    },
    shipped: {
      label: "Shipped",
      color: "hsl(43, 96%, 56%)", // amber
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(0, 84%, 60%)", // red
    },
  } satisfies ChartConfig;

  // ✅ Calculate totals for each status
  const totals = useMemo(() => {
    return salesData.reduce(
      (acc, curr) => ({
        confirmed: acc.confirmed + curr.confirmed,
        delivered: acc.delivered + curr.delivered,
        shipped: acc.shipped + curr.shipped,
        cancelled: acc.cancelled + curr.cancelled,
      }),
      { confirmed: 0, delivered: 0, shipped: 0, cancelled: 0 }
    );
  }, [salesData]);

  // ✅ Calculate total sales and growth percentage
  const totalSales = useMemo(() => {
    return Object.values(totals).reduce((sum, val) => sum + val, 0);
  }, [totals]);

  // ✅ Calculate growth trend (comparing last 2 data points if available)
  const growthPercentage = useMemo(() => {
    if (salesData.length < 2) return 0;

    const latest = salesData[salesData.length - 1];
    const previous = salesData[salesData.length - 2];

    const latestTotal =
      latest.confirmed + latest.delivered + latest.shipped + latest.cancelled;
    const previousTotal =
      previous.confirmed +
      previous.delivered +
      previous.shipped +
      previous.cancelled;

    if (previousTotal === 0) return 0;

    return ((latestTotal - previousTotal) / previousTotal) * 100;
  }, [salesData]);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={salesData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    const num =
                      typeof value === "number"
                        ? value
                        : parseFloat(value as string);
                    return `AED ${!isNaN(num) ? num.toFixed(2) : value}`;
                  }}
                />
              }
            />
            <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={4} />
            <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
            <Bar dataKey="shipped" fill="var(--color-shipped)" radius={4} />
            <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesTrendsChart;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import { useMemo } from "react";

// const SalesTrendsChart = ({ data }: { data: any[] }) => {
//   console.log(data, "Sales Trends Chart");

//   // ✅ Format date for X-axis (MM/DD)
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return `${date.getMonth() + 1}/${date.getDate()}`;
//   };

//   // ✅ Normalize field names dynamically for consistency
//   const salesData = useMemo(
//     () =>
//       data.map((item) => ({
//         date: item.date,
//         confirmed: item.conformSales || 0,
//         delivered: item.deliveredSales || 0,
//         shipped: item.shippedSales || 0,
//         cancelled: item.cancelledSales || 0,
//       })),
//     [data]
//   );

//   // ✅ Status configuration for easier maintenance
//   const statuses = [
//     { key: "confirmed", name: "Confirmed", color: "#06b6d4" },
//     { key: "delivered", name: "Delivered", color: "#8b5cf6" },
//     { key: "shipped", name: "Shipped", color: "#f59e0b" },
//     { key: "cancelled", name: "Cancelled", color: "#ef4444" },
//   ];

//   return (
//     <ResponsiveContainer width="100%" height={320}>
//       <BarChart
//         data={salesData}
//         margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
//       >
//         <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
//         <XAxis
//           dataKey="date"
//           tickFormatter={formatDate}
//           className="text-xs"
//           tickLine={false}
//           axisLine={false}
//         />
//         <YAxis className="text-xs" />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: "white",
//             border: "1px solid #e2e8f0",
//           }}
//           formatter={(value: any) => {
//             const num = typeof value === "number" ? value : parseFloat(value);
//             return `$${!isNaN(num) ? num.toFixed(2) : value}`;
//           }}
//         />
//         <Legend />

//         {/* ✅ Render bars dynamically for each status */}
//         {statuses.map((status) => (
//           <Bar
//             key={status.key}
//             dataKey={status.key}
//             fill={status.color}
//             name={status.name}
//             radius={[4, 4, 0, 0]}
//             barSize={28}
//           />
//         ))}
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default SalesTrendsChart;
