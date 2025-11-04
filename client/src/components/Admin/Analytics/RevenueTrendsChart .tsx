/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/UI/chart";
import { selectCategories } from "@/redux/features/Common/CommonSlice";
import { useAppSelector } from "@/redux/hooks";

interface RevenueData {
  date: string;
  category: string;
  totalRevenue: number;
}

interface RevenueTrendsChartProps {
  data: RevenueData[];
}

const RevenueTrendsChart = ({ data }: RevenueTrendsChartProps) => {
  const categories = useAppSelector(selectCategories);

  console.log(data, "over view selling");

  // 🔹 Format number to show max 1 decimal place
  const formatNumber = (value: number): string => {
    // Remove decimal if it's .0, otherwise show 1 decimal place
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  // 🔹 Transform data for the chart
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group by date and sum revenues
    const grouped: Record<string, any> = {};

    data.forEach((item) => {
      const { date, totalRevenue } = item;
      if (!grouped[date]) {
        grouped[date] = {
          date,
          totalRevenue: 0,
          formattedDate: formatDate(date),
        };
      }
      grouped[date].totalRevenue += Number(totalRevenue);
    });

    const result = Object.values(grouped);
    console.log("Chart data:", result);
    return result;
  }, [data]);

  // 🔹 Helper function to format date
  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  }

  // 🔹 Chart configuration
  const chartConfig: ChartConfig = {
    totalRevenue: {
      label: "Total Revenue",
      color: "hsl(271, 91%, 65%)", // violet color
    },
  };

  // 🔹 If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Showing revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>Showing total revenue over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full min-w-0"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={1}
              tickFormatter={(value) => {
                return formatDate(value);
              }}
              scale="point"
              padding={{ left: 20, right: 20 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  hideIndicator
                  formatter={(value, name) => {
                    const numValue =
                      typeof value === "number"
                        ? value
                        : parseFloat(value as string);
                    const formattedValue = !isNaN(numValue)
                      ? formatNumber(numValue)
                      : value;
                    return [
                      <span key="value" className="font-mono font-medium">
                        AED {formattedValue}
                      </span>,
                      name,
                    ];
                  }}
                  labelFormatter={(value) => {
                    return (
                      <div className="font-medium text-xs">
                        {formatDate(value)}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="totalRevenue"
              fill="var(--color-totalRevenue)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ChartContainer>

        {/* Summary statistics */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Total Period</div>
            <div className="font-medium">{chartData.length} days</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Average Revenue</div>
            <div className="font-medium">
              AED{" "}
              {formatNumber(
                chartData.reduce((sum, item) => sum + item.totalRevenue, 0) /
                  chartData.length
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsChart;
