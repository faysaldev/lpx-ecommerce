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
import { selectCategories } from "@/redux/features/Common/CommonSlice";
import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";

interface ProductSalesData {
  date: string;
  category: string;
  totalSales: number;
}

interface ProductsTrendsChartProps {
  data: ProductSalesData[];
}

const ProductsTrendsChart = ({ data }: ProductsTrendsChartProps) => {
  const categories = useAppSelector(selectCategories);
  console.log(data, "Products Trends Charts");

  // ✅ Assign consistent colors for each category
  const colorPalette = [
    "hsl(189, 94%, 43%)", // cyan
    "hsl(271, 91%, 65%)", // violet
    "hsl(43, 96%, 56%)", // amber
    "hsl(0, 84%, 60%)", // red
    "hsl(142, 76%, 47%)", // green
    "hsl(217, 91%, 60%)", // blue
    "hsl(291, 90%, 71%)", // pink
  ];

  // ✅ Create dynamic color mapping and chart config
  const { chartConfig, categoryColors } = useMemo(() => {
    const colors: Record<string, string> = {};
    const config: ChartConfig = {};

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

  // ✅ Transform data: group by date and sum sales per category
  const chartData = useMemo(() => {
    const grouped: Record<string, any> = {};

    data.forEach((item) => {
      const { date, category, totalSales } = item;
      if (!grouped[date]) {
        grouped[date] = { date };
        // Initialize all categories with 0
        categories?.forEach((cat: any) => {
          grouped[date][cat.name] = 0;
        });
      }

      // Add sales to the category
      grouped[date][category] =
        (grouped[date][category] || 0) + Number(totalSales);
    });

    return Object.values(grouped);
  }, [data, categories]);

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
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
                    return `${!isNaN(num) ? num : value} sales`;
                  }}
                />
              }
            />
            {categories?.map((cat: any) => (
              <Bar
                key={cat.name}
                dataKey={cat.name}
                fill={categoryColors[cat.name]}
                radius={4}
                maxBarSize={20}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductsTrendsChart;
