/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/UI/card";
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
