/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectCategories } from "@/redux/features/Common/CommonSlice";
import { useAppSelector } from "@/redux/hooks";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useMemo } from "react";

const RevenueTrendsChart = ({ data }: { data: any[] }) => {
  const categories = useAppSelector(selectCategories);
  console.log(categories, "All Categories");
  console.log(data, "Revenue Data");

  // 🔹 Generate readable short date (MM/DD)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 🔹 Assign consistent colors for each category (extendable)
  const colorPalette = [
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#f59e0b", // amber
    "#ef4444", // red
    "#22c55e", // green
    "#3b82f6", // blue
    "#e879f9", // pink
  ];

  // 🔹 Create dynamic color mapping for categories
  const categoryColors = useMemo(() => {
    return categories?.reduce((acc: any, cat: any, index: number) => {
      acc[cat.name] = colorPalette[index % colorPalette.length];
      return acc;
    }, {});
  }, [categories]);

  // 🔹 Transform data: group by date and assign category revenues dynamically
  const revenueData = useMemo(() => {
    const grouped: Record<string, any> = {};

    data.forEach((item) => {
      const { date, category, totalRevenue } = item;
      if (!grouped[date]) grouped[date] = { date };

      // Assign revenue per category name
      grouped[date][category] =
        (grouped[date][category] || 0) + Number(totalRevenue);
    });

    return Object.values(grouped);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={revenueData}>
        {/* === Define color gradients dynamically === */}
        <defs>
          {categories?.map((cat) => (
            <linearGradient
              key={cat.name}
              id={`color-${cat.name.replace(/\s+/g, "-")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={categoryColors[cat.name]}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={categoryColors[cat.name]}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
        <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
          }}
          formatter={(value) => {
            const num =
              typeof value === "number" ? value : parseFloat(value as string);
            return `$${!isNaN(num) ? num.toFixed(2) : value}`;
          }}
        />
        <Legend />

        {/* === Render each category dynamically === */}
        {categories?.map((cat) => (
          <Area
            key={cat.name}
            type="monotone"
            dataKey={cat.name}
            stroke={categoryColors[cat.name]}
            fillOpacity={1}
            fill={`url(#color-${cat.name.replace(/\s+/g, "-")})`}
            name={cat.name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
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

// const RevenueTrendsChart = ({ data }: { data: any[] }) => {
//   console.log(data, "revinue data");

//   const categories = useAppSelector(selectCategories);
//   console.log(categories, "all Categorie");

//   const formatDate = (dateStr: any) => {
//     const date = new Date(dateStr);
//     return `${date.getMonth() + 1}/${date.getDate()}`;
//   };
//   // Revenue data by status
//   const revenueData = [
//     {
//       date: "2025-09-09",
//       delivered: 42.5,
//       confirmed: 0,
//       shipped: 0,
//       cancelled: 0,
//     },
//     {
//       date: "2025-09-16",
//       delivered: 38.2,
//       confirmed: 0,
//       shipped: 0,
//       cancelled: 0,
//     },
//     {
//       date: "2025-09-23",
//       delivered: 45.8,
//       confirmed: 0,
//       shipped: 0,
//       cancelled: 0,
//     },
//     {
//       date: "2025-09-30",
//       delivered: 51.3,
//       confirmed: 0,
//       shipped: 0,
//       cancelled: 0,
//     },
//     {
//       date: "2025-10-06",
//       delivered: 52.92,
//       confirmed: 0,
//       shipped: 0,
//       cancelled: 0,
//     },
//     {
//       date: "2025-10-07",
//       delivered: 74.25,
//       confirmed: 28819.4,
//       shipped: 0,
//       cancelled: 0,
//     },
//   ];
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <AreaChart data={revenueData}>
//         <defs>
//           <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
//             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
//           </linearGradient>
//           <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
//             <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
//           </linearGradient>
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
//         <Area
//           type="monotone"
//           dataKey="delivered"
//           stroke="#8b5cf6"
//           fillOpacity={1}
//           fill="url(#colorDelivered)"
//           name="Delivered"
//         />
//         <Area
//           type="monotone"
//           dataKey="confirmed"
//           stroke="#06b6d4"
//           fillOpacity={1}
//           fill="url(#colorConfirmed)"
//           name="Confirmed"
//         />
//         <Area
//           type="monotone"
//           dataKey="shipped"
//           stroke="#f59e0b"
//           fill="#f59e0b"
//           name="Shipped"
//         />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default RevenueTrendsChart;
