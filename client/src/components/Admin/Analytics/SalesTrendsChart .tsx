/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const SalesTrendsChart = ({ data }: { data: any[] }) => {
  // Sales data by status
  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  const salesData = [
    {
      date: "2025-09-09",
      confirmed: 0,
      delivered: 1,
      cancelled: 0,
      shipped: 0,
    },
    {
      date: "2025-09-16",
      confirmed: 0,
      delivered: 1,
      cancelled: 0,
      shipped: 0,
    },
    {
      date: "2025-09-23",
      confirmed: 0,
      delivered: 2,
      cancelled: 0,
      shipped: 0,
    },
    {
      date: "2025-09-30",
      confirmed: 0,
      delivered: 1,
      cancelled: 0,
      shipped: 0,
    },
    {
      date: "2025-10-06",
      confirmed: 0,
      delivered: 1,
      cancelled: 0,
      shipped: 0,
    },
    {
      date: "2025-10-07",
      confirmed: 5,
      delivered: 2,
      cancelled: 0,
      shipped: 0,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
        <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
          }}
        />
        <Legend />
        <Bar dataKey="confirmed" fill="#06b6d4" name="Confirmed" />
        <Bar dataKey="delivered" fill="#8b5cf6" name="Delivered" />
        <Bar dataKey="shipped" fill="#f59e0b" name="Shipped" />
        <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesTrendsChart;
