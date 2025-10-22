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
  Sector,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  Cell,
} from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/UI/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/UI/chart";
// import { useVendorAnalyticsQuery } from "@/redux/features/vendors/VendorDashboard";
// import { BarChart3, TrendingUp } from "lucide-react";
// import React, { useMemo } from "react";
// import {
//   LabelList,
//   Pie,
//   PieChart,
//   CartesianGrid,
//   Line,
//   LineChart,
//   XAxis,
// } from "recharts";

// function AnalysisSection() {
//   const { data, isLoading } = useVendorAnalyticsQuery({});

//   const performance = data?.data?.attributes?.performanceMetrics;
//   const revenueData = data?.data?.attributes?.revenueTrends;

//   console.log("Vendor Dashboard Performance", performance);
//   console.log("Vendor Dashboard revenue Data", revenueData);

//   // ✅ Prepare data for pie chart
//   const { pieChartData, chartConfig } = useMemo(() => {
//     if (!performance) {
//       return { pieChartData: [], chartConfig: {} };
//     }

//     const data = [
//       {
//         name: "completedOrders",
//         label: "Completed Orders",
//         value: performance.completedOrdersCount ?? 0,
//         fill: "var(--color-completedOrders)",
//       },
//       {
//         name: "vendorRatings",
//         label: "Vendor Ratings",
//         value: performance.vendorRatingsCount ?? 0,
//         fill: "var(--color-vendorRatings)",
//       },
//       {
//         name: "productRatings",
//         label: "Product Ratings",
//         value: performance.productRatingsCount ?? 0,
//         fill: "var(--color-productRatings)",
//       },
//     ];

//     const config: ChartConfig = {
//       value: {
//         label: "Count",
//       },
//       completedOrders: {
//         label: "Completed Orders",
//         color: "hsl(217, 91%, 60%)", // blue
//       },
//       vendorRatings: {
//         label: "Vendor Ratings",
//         color: "hsl(142, 76%, 47%)", // green
//       },
//       productRatings: {
//         label: "Product Ratings",
//         color: "hsl(271, 91%, 65%)", // violet
//       },
//     };

//     return { pieChartData: data, chartConfig: config };
//   }, [performance]);

//   // ✅ Calculate total performance count
//   const totalPerformance = useMemo(() => {
//     return pieChartData.reduce((sum, item) => sum + item.value, 0);
//   }, [pieChartData]);

//   // ✅ Revenue chart config
//   const revenueChartConfig = {
//     revenue: {
//       label: "Revenue",
//       color: "hsl(217, 91%, 60%)", // blue
//     },
//   } satisfies ChartConfig;

//   // ✅ Calculate total revenue and growth
//   const { totalRevenue, growthPercentage } = useMemo(() => {
//     if (!revenueData || revenueData.length === 0) {
//       return { totalRevenue: 0, growthPercentage: 0 };
//     }

//     const total = revenueData.reduce(
//       (sum: number, item: any) => sum + (item.revenue || 0),
//       0
//     );

//     // Calculate growth trend (comparing last 2 data points)
//     let growth = 0;
//     if (revenueData.length >= 2) {
//       const latest = revenueData[revenueData.length - 1].revenue;
//       const previous = revenueData[revenueData.length - 2].revenue;

//       if (previous !== 0) {
//         growth = ((latest - previous) / previous) * 100;
//       }
//     }

//     return { totalRevenue: total, growthPercentage: growth };
//   }, [revenueData]);

//   // ✅ Get date range for revenue
//   const dateRange = useMemo(() => {
//     if (!revenueData || revenueData.length === 0) return "";

//     const startDate = new Date(revenueData[0].date);
//     const endDate = new Date(revenueData[revenueData.length - 1].date);

//     return `${startDate.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     })} - ${endDate.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })}`;
//   }, [revenueData]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* ---------- Performance Metrics (Pie Chart) ---------- */}
//       <Card className="flex flex-col">
//         <CardHeader className="items-center pb-0">
//           <CardTitle>Performance Metrics</CardTitle>
//           <CardDescription>Store analytics overview</CardDescription>
//         </CardHeader>
//         <CardContent className="flex-1 pb-0">
//           {isLoading ? (
//             <div className="flex items-center justify-center h-[250px]">
//               <p className="text-center text-muted-foreground">Loading...</p>
//             </div>
//           ) : totalPerformance > 0 ? (
//             <ChartContainer
//               config={chartConfig}
//               className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
//             >
//               <PieChart>
//                 <ChartTooltip
//                   content={<ChartTooltipContent nameKey="value" hideLabel />}
//                 />
//                 <Pie data={pieChartData} dataKey="value">
//                   <LabelList
//                     dataKey="name"
//                     className="fill-background"
//                     stroke="none"
//                     fontSize={12}
//                   />
//                 </Pie>
//               </PieChart>
//             </ChartContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[250px] text-center">
//               <BarChart3 className="h-12 w-12 mb-4 text-muted-foreground/50" />
//               <p className="text-muted-foreground font-medium">
//                 No performance data yet
//               </p>
//               <p className="text-sm text-muted-foreground mt-2">
//                 Analytics will show when you have data
//               </p>
//             </div>
//           )}
//         </CardContent>
//         <CardFooter className="flex-col gap-2 text-sm">
//           {totalPerformance > 0 ? (
//             <>
//               <div className="flex items-center gap-2 leading-none font-medium">
//                 Total performance metrics: {totalPerformance}
//               </div>
//               <div className="text-muted-foreground leading-none">
//                 {performance?.completedOrdersCount || 0} orders •{" "}
//                 {performance?.vendorRatingsCount || 0} vendor ratings •{" "}
//                 {performance?.productRatingsCount || 0} product ratings
//               </div>
//             </>
//           ) : (
//             <div className="text-muted-foreground leading-none text-center">
//               Complete orders to see performance metrics
//             </div>
//           )}
//         </CardFooter>
//       </Card>

//       {/* ---------- Revenue Trends (Line Chart) ---------- */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Revenue Trends</CardTitle>
//           <CardDescription>
//             {dateRange || "Daily revenue overview"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex items-center justify-center h-[250px]">
//               <p className="text-center text-muted-foreground">Loading...</p>
//             </div>
//           ) : revenueData && revenueData.length > 0 ? (
//             <ChartContainer config={revenueChartConfig}>
//               <LineChart
//                 accessibilityLayer
//                 data={revenueData}
//                 margin={{
//                   left: 12,
//                   right: 12,
//                 }}
//               >
//                 <CartesianGrid vertical={false} />
//                 <XAxis
//                   dataKey="date"
//                   tickLine={false}
//                   axisLine={false}
//                   tickMargin={8}
//                   tickFormatter={(value) => {
//                     const date = new Date(value);
//                     return date.toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     });
//                   }}
//                 />
//                 <ChartTooltip
//                   cursor={false}
//                   content={
//                     <ChartTooltipContent
//                       hideLabel
//                       formatter={(value) => {
//                         const num =
//                           typeof value === "number"
//                             ? value
//                             : parseFloat(value as string);
//                         return `$${!isNaN(num) ? num.toFixed(2) : value}`;
//                       }}
//                     />
//                   }
//                 />
//                 <Line
//                   dataKey="revenue"
//                   type="natural"
//                   stroke="var(--color-revenue)"
//                   strokeWidth={2}
//                   dot={{
//                     fill: "var(--color-revenue)",
//                   }}
//                   activeDot={{
//                     r: 6,
//                   }}
//                 />
//               </LineChart>
//             </ChartContainer>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[250px] text-center">
//               <TrendingUp className="h-12 w-12 mb-4 text-muted-foreground/50" />
//               <p className="text-muted-foreground font-medium">
//                 No revenue data yet
//               </p>
//               <p className="text-sm text-muted-foreground mt-2">
//                 Revenue data will appear here
//               </p>
//             </div>
//           )}
//         </CardContent>
//         <CardFooter className="flex-col items-start gap-2 text-sm">
//           {revenueData && revenueData.length > 0 ? (
//             <>
//               <div className="flex gap-2 leading-none font-medium">
//                 {growthPercentage >= 0 ? (
//                   <>
//                     Trending up by {Math.abs(growthPercentage).toFixed(1)}%{" "}
//                     <TrendingUp className="h-4 w-4" />
//                   </>
//                 ) : (
//                   <>
//                     Trending down by {Math.abs(growthPercentage).toFixed(1)}%{" "}
//                     <TrendingUp className="h-4 w-4 rotate-180" />
//                   </>
//                 )}
//               </div>
//               <div className="text-muted-foreground leading-none">
//                 Total revenue: ${totalRevenue.toFixed(2)}
//               </div>
//             </>
//           ) : (
//             <div className="text-muted-foreground leading-none">
//               Start selling to see revenue trends
//             </div>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// export default AnalysisSection;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/UI/card";
// import { useVendorAnalyticsQuery } from "@/redux/features/vendors/VendorDashboard";
// import { BarChart3, TrendingUp } from "lucide-react";
// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// // Colors for the pie chart
// const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

// function AnalysisSection() {
//   const { data, isLoading } = useVendorAnalyticsQuery({});

//   const performance = data?.data?.attributes?.performanceMetrics;
//   const revenueData = data?.data?.attributes?.revenueTrends;

//   console.log("Vendor Dashboard Performance", performance);
//   console.log("Vendor Dashboard revenue Data", revenueData);

//   // Prepare data for pie chart
//   const pieChartData = performance
//     ? [
//         {
//           name: "Vendor Ratings",
//           value: performance.vendorRatingsCount ?? 0,
//         },
//         {
//           name: "Product Ratings",
//           value: performance.productRatingsCount ?? 0,
//         },
//         {
//           name: "Completed Orders",
//           value: performance.completedOrdersCount ?? 0,
//         },
//       ]
//     : [];

//   // Custom label renderer for the pie chart
//   const renderCustomizedLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//   }: any) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
//     const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="white"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         className="font-semibold"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* ---------- Performance Metrics ---------- */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Performance Metrics</CardTitle>
//           <CardDescription>Store analytics</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <p className="text-center text-muted-foreground">Loading...</p>
//           ) : performance && pieChartData.some((item) => item.value > 0) ? (
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieChartData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={renderCustomizedLabel}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {pieChartData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${entry.name}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Legend
//                     verticalAlign="bottom"
//                     height={36}
//                     formatter={(value, entry: any) =>
//                       `${value}: ${entry.payload.value}`
//                     }
//                   />
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="text-center py-8 text-muted-foreground">
//               <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
//               <p>Analytics will show when you have data</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* ---------- Revenue Trends ---------- */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Revenue Trends</CardTitle>
//           <CardDescription>Daily revenue overview</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {revenueData && revenueData.length > 0 ? (
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={revenueData}>
//                   <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <div className="text-center py-8 text-muted-foreground">
//               <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
//               <p>Revenue data will appear here</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default AnalysisSection;
