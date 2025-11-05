/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { useVendorAnalyticsQuery } from "@/redux/features/vendors/VendorDashboard";
import { TrendingUp } from "lucide-react";
import React from "react";
import {
  Label,
  Pie,
  PieChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/UI/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";

// Chart configuration
const performanceChartConfig = {
  completedOrdersCount: {
    label: "Completed Orders",
    color: "var(--chart-1)",
  },
  vendorRatingsCount: {
    label: "Vendor Ratings",
    color: "var(--chart-2)",
  },
  productRatingsCount: {
    label: "Product Ratings",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "blue", // Blue color for the revenue chart
  },
} satisfies ChartConfig;

function AnalysisSection() {
  const { data, isLoading } = useVendorAnalyticsQuery({});

  const performance = data?.data?.attributes?.performanceMetrics;
  const revenueData = data?.data?.attributes?.revenueTrends;

  // Prepare data for performance pie chart
  const performanceData = performance
    ? [
        {
          name: "completedOrdersCount",
          value: performance.completedOrdersCount ?? 0,
          label: "Completed Orders",
          fill: "var(--color-completedOrdersCount)",
        },
        {
          name: "vendorRatingsCount",
          value: performance.vendorRatingsCount ?? 0,
          label: "Vendor Ratings",
          fill: "var(--color-vendorRatingsCount)",
        },
        {
          name: "productRatingsCount",
          value: performance.productRatingsCount ?? 0,
          label: "Product Ratings",
          fill: "var(--color-productRatingsCount)",
        },
      ]
    : [];

  // State for interactive pie chart
  const [activeMetric, setActiveMetric] = React.useState(
    performanceData[0]?.name || "completedOrdersCount"
  );

  const activeIndex = React.useMemo(
    () => performanceData.findIndex((item) => item.name === activeMetric),
    [activeMetric, performanceData]
  );

  const metrics = React.useMemo(
    () => performanceData.map((item) => item.name),
    [performanceData]
  );

  // Format revenue data for line chart
  const formattedRevenueData = revenueData
    ? revenueData.map((item: any) => ({
        date: item.date,
        revenue: item.revenue,
        formattedDate: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
    : [];

  const performanceChartId = "performance-pie";
  const revenueChartId = "revenue-line";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ---------- Performance Metrics ---------- */}
      <Card data-chart={performanceChartId} className="flex flex-col">
        <ChartStyle id={performanceChartId} config={performanceChartConfig} />
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Store analytics overview</CardDescription>
          </div>
          {performanceData.length > 0 && (
            <Select value={activeMetric} onValueChange={setActiveMetric}>
              <SelectTrigger
                className="ml-auto h-7 w-[180px] rounded-lg pl-3 pr-3 py-1" // Increased width and padding
                aria-label="Select a metric"
              >
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {metrics.map((key) => {
                  const config =
                    performanceChartConfig[
                      key as keyof typeof performanceChartConfig
                    ];

                  if (!config) {
                    return null;
                  }

                  return (
                    <SelectItem
                      key={key}
                      value={key}
                      className="rounded-lg [&_span]:flex"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className="flex h-3 w-3 shrink-0 rounded-xs"
                          style={{
                            backgroundColor: `var(--color-${key})`,
                          }}
                        />
                        {config?.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : performanceData.length > 0 ? (
            <ChartContainer
              id={performanceChartId}
              config={performanceChartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={performanceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#5774E7" />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const activeData = performanceData[activeIndex];
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {activeData?.value.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              {activeData?.label}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground w-full">
              <div className="h-12 w-12 mx-auto mb-4 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p>Analytics will show when you have data</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---------- Revenue Trends ---------- */}
      <Card>
        <ChartStyle id={revenueChartId} config={revenueChartConfig} />
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {formattedRevenueData.length > 0 ? (
            <ChartContainer config={revenueChartConfig}>
              <LineChart
                accessibilityLayer
                data={formattedRevenueData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="revenue"
                  type="natural"
                  stroke="blue" // Set the stroke color to blue
                  strokeWidth={2}
                  dot={{
                    fill: "blue", // Set the dot color to blue
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Revenue data will appear here</p>
            </div>
          )}
        </CardContent>
        {formattedRevenueData.length > 0 && (
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Revenue tracking <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              Showing daily revenue for your store
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default AnalysisSection;
