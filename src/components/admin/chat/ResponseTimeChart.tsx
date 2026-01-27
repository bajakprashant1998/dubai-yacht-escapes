import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";

interface DailyTrend {
  date: string;
  conversations: number;
  leads: number;
}

interface ResponseTimeChartProps {
  data: DailyTrend[];
  avgResponseTime?: number;
}

const ResponseTimeChart = ({ data, avgResponseTime = 120 }: ResponseTimeChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    displayDate: format(parseISO(item.date), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <ReferenceLine
          y={avgResponseTime}
          stroke="hsl(var(--destructive))"
          strokeDasharray="3 3"
          label={{ value: "Target", position: "right", fontSize: 12 }}
        />
        <Bar
          dataKey="conversations"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          name="Response Time (s)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResponseTimeChart;
