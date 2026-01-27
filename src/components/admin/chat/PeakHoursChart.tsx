import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyData {
  hour: number;
  count: number;
}

interface PeakHoursChartProps {
  data: HourlyData[];
}

const PeakHoursChart = ({ data }: PeakHoursChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    displayHour: `${item.hour.toString().padStart(2, "0")}:00`,
  }));

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="displayHour"
          tick={{ fontSize: 10 }}
          interval={2}
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
          formatter={(value: number) => [value, "Messages"]}
        />
        <Bar
          dataKey="count"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          fillOpacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PeakHoursChart;
