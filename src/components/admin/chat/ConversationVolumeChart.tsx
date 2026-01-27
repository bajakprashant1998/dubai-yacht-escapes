import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

interface DailyTrend {
  date: string;
  conversations: number;
  leads: number;
}

interface ConversationVolumeChartProps {
  data: DailyTrend[];
}

const ConversationVolumeChart = ({ data }: ConversationVolumeChartProps) => {
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
      <LineChart data={formattedData}>
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
        <Legend />
        <Line
          type="monotone"
          dataKey="conversations"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
          name="Conversations"
        />
        <Line
          type="monotone"
          dataKey="leads"
          stroke="hsl(142, 76%, 36%)"
          strokeWidth={2}
          dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
          name="Leads Captured"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ConversationVolumeChart;
