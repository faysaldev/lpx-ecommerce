/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const UsersTrendsChart = ({ data }: { data: any[] }) => {
  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Users data
  const usersData = [
    { date: "2025-09-09", totalUsers: 1 },
    { date: "2025-09-16", totalUsers: 1 },
    { date: "2025-09-23", totalUsers: 2 },
    { date: "2025-09-30", totalUsers: 2 },
    { date: "2025-10-06", totalUsers: 1 },
    { date: "2025-10-07", totalUsers: 3 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={usersData}>
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
        <Line
          type="monotone"
          dataKey="totalUsers"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", r: 5 }}
          name="Total Users"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UsersTrendsChart;
