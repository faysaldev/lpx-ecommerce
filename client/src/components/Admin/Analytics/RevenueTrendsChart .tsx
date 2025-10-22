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

  // 🔹 Assign consistent colors for each category
  const colorPalette = [
    "hsl(271, 91%, 65%)", // violet
    "hsl(189, 94%, 43%)", // cyan
    "hsl(43, 96%, 56%)", // amber
    "hsl(0, 84%, 60%)", // red
    "hsl(142, 76%, 47%)", // green
    "hsl(217, 91%, 60%)", // blue
    "hsl(291, 90%, 71%)", // pink
  ];

  // 🔹 Create dynamic color mapping and chart config
  const { chartConfig, categoryColors } = React.useMemo(() => {
    const colors: Record<string, string> = {};
    const config: ChartConfig = {
      totalRevenue: {
        label: "Total Revenue",
      },
    };

    categories?.forEach((cat: any, index: number) => {
      const color = colorPalette[index % colorPalette.length];
      colors[cat.name] = color;
      config[cat.name] = {
        label: cat.name,
        color: color,
      };
    });

    return { chartConfig: config, categoryColors: colors };
  }, [categories]);

  // 🔹 Transform data: group by date and sum revenues per category
  const chartData = React.useMemo(() => {
    const grouped: Record<string, any> = {};

    data.forEach((item) => {
      const { date, category, totalRevenue } = item;
      if (!grouped[date]) {
        grouped[date] = { date };
        // Initialize all categories with 0
        categories?.forEach((cat: any) => {
          grouped[date][cat.name] = 0;
        });
      }

      // Add revenue to the category
      grouped[date][category] =
        (grouped[date][category] || 0) + Number(totalRevenue);
    });

    return Object.values(grouped);
  }, [data, categories]);

  // 🔹 Calculate total revenue per category
  const totalRevenue = React.useMemo(() => {
    const totals: Record<string, number> = {};

    categories?.forEach((cat: any) => {
      totals[cat.name] = chartData.reduce(
        (acc, curr) => acc + (curr[cat.name] || 0),
        0
      );
    });

    return totals;
  }, [chartData, categories]);

  // 🔹 Active chart state (default to first category)
  const [activeChart, setActiveChart] = React.useState<string>(
    categories?.[0]?.name || ""
  );

  // Update active chart when categories load
  if (!categories?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No categories available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>
            Showing revenue by category over time
          </CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {categories.map((cat: any) => {
            const isActive = activeChart === cat.name;
            return (
              <button
                key={cat.name}
                data-active={isActive}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 min-w-[140px]"
                onClick={() => setActiveChart(cat.name)}
              >
                <span className="text-muted-foreground text-xs truncate">
                  {cat.name}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  AED {totalRevenue[cat.name]?.toFixed(2) || "0.00"}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="totalRevenue"
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
            <Bar
              dataKey={activeChart}
              fill={categoryColors[activeChart]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendsChart;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { selectCategories } from "@/redux/features/Common/CommonSlice";
// import { useAppSelector } from "@/redux/hooks";
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useMemo } from "react";

// const RevenueTrendsChart = ({ data }: { data: any[] }) => {
//   const categories = useAppSelector(selectCategories);
//   console.log(categories, "All Categories");
//   console.log(data, "Revenue Data");

//   // 🔹 Generate readable short date (MM/DD)
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return `${date.getMonth() + 1}/${date.getDate()}`;
//   };

//   // 🔹 Assign consistent colors for each category (extendable)
//   const colorPalette = [
//     "#8b5cf6", // violet
//     "#06b6d4", // cyan
//     "#f59e0b", // amber
//     "#ef4444", // red
//     "#22c55e", // green
//     "#3b82f6", // blue
//     "#e879f9", // pink
//   ];

//   // 🔹 Create dynamic color mapping for categories
//   const categoryColors = useMemo(() => {
//     return categories?.reduce((acc: any, cat: any, index: number) => {
//       acc[cat.name] = colorPalette[index % colorPalette.length];
//       return acc;
//     }, {});
//   }, [categories]);

//   // 🔹 Transform data: group by date and assign category revenues dynamically
//   const revenueData = useMemo(() => {
//     const grouped: Record<string, any> = {};

//     data.forEach((item) => {
//       const { date, category, totalRevenue } = item;
//       if (!grouped[date]) grouped[date] = { date };

//       // Assign revenue per category name
//       grouped[date][category] =
//         (grouped[date][category] || 0) + Number(totalRevenue);
//     });

//     return Object.values(grouped);
//   }, [data]);

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <AreaChart data={revenueData}>
//         {/* === Define color gradients dynamically === */}
//         <defs>
//           {categories?.map((cat) => (
//             <linearGradient
//               key={cat.name}
//               id={`color-${cat.name.replace(/\s+/g, "-")}`}
//               x1="0"
//               y1="0"
//               x2="0"
//               y2="1"
//             >
//               <stop
//                 offset="5%"
//                 stopColor={categoryColors[cat.name]}
//                 stopOpacity={0.8}
//               />
//               <stop
//                 offset="95%"
//                 stopColor={categoryColors[cat.name]}
//                 stopOpacity={0}
//               />
//             </linearGradient>
//           ))}
//         </defs>

//         <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
//         <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
//         <YAxis className="text-xs" />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: "white",
//             border: "1px solid #e2e8f0",
//           }}
//           formatter={(value) => {
//             const num =
//               typeof value === "number" ? value : parseFloat(value as string);
//             return `$${!isNaN(num) ? num.toFixed(2) : value}`;
//           }}
//         />
//         <Legend />

//         {/* === Render each category dynamically === */}
//         {categories?.map((cat) => (
//           <Area
//             key={cat.name}
//             type="monotone"
//             dataKey={cat.name}
//             stroke={categoryColors[cat.name]}
//             fillOpacity={1}
//             fill={`url(#color-${cat.name.replace(/\s+/g, "-")})`}
//             name={cat.name}
//           />
//         ))}
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default RevenueTrendsChart;
