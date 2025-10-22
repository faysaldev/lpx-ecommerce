/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/UI/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/UI/chart";
import { useMemo } from "react";

type UserTrend = {
  date: string;
  totalUsers: number;
};

interface UsersTrendsChartProps {
  data: UserTrend[];
}

const UsersTrendsChart = ({ data }: UsersTrendsChartProps) => {
  console.log(data, "User Growth Data");

  // ✅ Chart configuration
  const chartConfig = {
    totalUsers: {
      label: "Total Users",
      color: "hsl(271, 91%, 65%)", // violet
    },
  } satisfies ChartConfig;

  // ✅ Calculate total users and growth percentage
  const { totalUsers, growthPercentage } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.totalUsers, 0);

    // Calculate growth trend (comparing last 2 data points if available)
    let growth = 0;
    if (data.length >= 2) {
      const latest = data[data.length - 1].totalUsers;
      const previous = data[data.length - 2].totalUsers;

      if (previous !== 0) {
        growth = ((latest - previous) / previous) * 100;
      }
    }

    return { totalUsers: total, growthPercentage: growth };
  }, [data]);

  // ✅ Get date range for description
  const dateRange = useMemo(() => {
    if (data.length === 0) return "";

    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);

    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }, [data]);

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
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
                  hideLabel
                  formatter={(value) => {
                    const num =
                      typeof value === "number"
                        ? value
                        : parseFloat(value as string);
                    return `${!isNaN(num) ? num : value} users`;
                  }}
                />
              }
            />
            <Bar
              dataKey="totalUsers"
              fill="var(--color-totalUsers)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UsersTrendsChart;
