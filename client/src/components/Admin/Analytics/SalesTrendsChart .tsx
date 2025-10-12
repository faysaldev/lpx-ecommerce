/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useMemo } from "react";

const SalesTrendsChart = ({ data }: { data: any[] }) => {
  console.log(data, "Sales Trends Chart");

  // ✅ Format date for X-axis (MM/DD)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

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

  // ✅ Status configuration for easier maintenance
  const statuses = [
    { key: "confirmed", name: "Confirmed", color: "#06b6d4" },
    { key: "delivered", name: "Delivered", color: "#8b5cf6" },
    { key: "shipped", name: "Shipped", color: "#f59e0b" },
    { key: "cancelled", name: "Cancelled", color: "#ef4444" },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={salesData}
        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
          }}
          formatter={(value: any) => {
            const num = typeof value === "number" ? value : parseFloat(value);
            return `$${!isNaN(num) ? num.toFixed(2) : value}`;
          }}
        />
        <Legend />

        {/* ✅ Render bars dynamically for each status */}
        {statuses.map((status) => (
          <Bar
            key={status.key}
            dataKey={status.key}
            fill={status.color}
            name={status.name}
            radius={[4, 4, 0, 0]}
            barSize={28}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
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

// const SalesTrendsChart = ({ data }: { data: any[] }) => {
//   console.log(data, "sales Trends Charts");

//   const formatDate = (dateStr: any) => {
//     const date = new Date(dateStr);
//     return `${date.getMonth() + 1}/${date.getDate()}`;
//   };

//   // Transform the data to match the chart format
//   const salesData = data.map((item) => ({
//     date: item.date,
//     confirmed: item.conformSales || 0,
//     delivered: item.deliveredSales || 0,
//     cancelled: item.cancelledSales || 0,
//     shipped: item.shippedSales || 0,
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={salesData}>
//         <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
//         <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
//         <YAxis className="text-xs" />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: "white",
//             border: "1px solid #e2e8f0",
//           }}
//         />
//         <Legend />
//         <Bar dataKey="confirmed" fill="#06b6d4" name="Confirmed" />
//         <Bar dataKey="delivered" fill="#8b5cf6" name="Delivered" />
//         <Bar dataKey="shipped" fill="#f59e0b" name="Shipped" />
//         <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default SalesTrendsChart;
