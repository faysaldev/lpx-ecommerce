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

type UserTrend = {
  date: string;
  totalUsers: number;
};

interface UsersTrendsChartProps {
  data: UserTrend[];
}

const UsersTrendsChart = ({ data }: UsersTrendsChartProps) => {
  // ✅ Chart configuration
  const chartConfig = {
    totalUsers: {
      label: "Total Users",
      color: "hsl(271, 91%, 65%)", // violet
    },
  } satisfies ChartConfig;
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
              maxBarSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UsersTrendsChart;
