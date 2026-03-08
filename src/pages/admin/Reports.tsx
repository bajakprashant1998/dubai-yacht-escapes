import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, DollarSign, Calendar, Users } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Reports = () => {
  const [dateRange, setDateRange] = useState("30");
  const { toast } = useToast();

  const startDate = subDays(new Date(), parseInt(dateRange));

  const { data: bookings = [] } = useQuery({
    queryKey: ["report-bookings", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ["report-inquiries", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .gte("created_at", startDate.toISOString());
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.total_price), 0);
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
  const confirmedRate = bookings.length > 0 ? (bookings.filter((b) => b.status === "confirmed").length / bookings.length * 100) : 0;

  // Daily revenue chart
  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: startDate, end: new Date() });
    return days.map((day) => {
      const dayBookings = bookings.filter((b) => format(new Date(b.created_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
      return {
        date: format(day, "MMM d"),
        revenue: dayBookings.reduce((s, b) => s + Number(b.total_price), 0),
        bookings: dayBookings.length,
      };
    });
  }, [bookings, startDate]);

  // Status breakdown
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Top tours
  const topTours = useMemo(() => {
    const tourMap: Record<string, { name: string; count: number; revenue: number }> = {};
    bookings.forEach((b) => {
      if (!tourMap[b.tour_name]) tourMap[b.tour_name] = { name: b.tour_name, count: 0, revenue: 0 };
      tourMap[b.tour_name].count++;
      tourMap[b.tour_name].revenue += Number(b.total_price);
    });
    return Object.values(tourMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [bookings]);

  const exportCSV = () => {
    const headers = ["Date", "Customer", "Tour", "Status", "Total Price"];
    const rows = bookings.map((b) => [
      format(new Date(b.created_at), "yyyy-MM-dd"),
      b.customer_name,
      b.tour_name,
      b.status,
      b.total_price,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${bookings.length} bookings exported` });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Advanced analytics, revenue forecasting, and exportable reports</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV} className="gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">AED {totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Revenue</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{bookings.length}</p><p className="text-sm text-muted-foreground">Total Bookings</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">AED {avgBookingValue.toFixed(0)}</p><p className="text-sm text-muted-foreground">Avg Booking Value</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{confirmedRate.toFixed(1)}%</p><p className="text-sm text-muted-foreground">Confirmation Rate</p></div>
          </CardContent></Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Booking Status Breakdown</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(e) => `${e.name}: ${e.value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daily Bookings Bar Chart */}
        <Card>
          <CardHeader><CardTitle>Daily Bookings</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Tours Table */}
        <Card>
          <CardHeader><CardTitle>Top Performing Tours</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Tour Name</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTours.map((t, i) => (
                  <TableRow key={t.name}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.count}</TableCell>
                    <TableCell>AED {t.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {topTours.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No booking data in this period</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Reports;
