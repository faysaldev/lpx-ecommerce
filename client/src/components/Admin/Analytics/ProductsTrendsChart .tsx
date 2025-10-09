/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
} from "recharts";

const ProductsTrendsChart = ({ data }: { data: any[] }) => {
  const formatDate = (dateStr: any) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Products data
  const productsData = [
    { date: "2025-09-09", Tech: 1, "Fashion & Beauty": 0, TGC: 0 },
    { date: "2025-09-16", Tech: 2, "Fashion & Beauty": 1, TGC: 0 },
    { date: "2025-09-23", Tech: 1, "Fashion & Beauty": 2, TGC: 1 },
    { date: "2025-09-30", Tech: 2, "Fashion & Beauty": 3, TGC: 1 },
    { date: "2025-10-06", Tech: 1, "Fashion & Beauty": 0, TGC: 0 },
    { date: "2025-10-07", Tech: 0, "Fashion & Beauty": 5, TGC: 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={productsData}>
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
        <Bar dataKey="Tech" fill="#06b6d4" />
        <Bar dataKey="Fashion & Beauty" fill="#8b5cf6" />
        <Bar dataKey="TGC" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductsTrendsChart;
