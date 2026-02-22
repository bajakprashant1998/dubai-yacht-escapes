import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import SalesChart from "@/components/admin/SalesChart";
import VisitorsChart from "@/components/admin/VisitorsChart";
import CustomerRetentionChart from "@/components/admin/CustomerRetentionChart";
import { DollarSign, TrendingUp, Users, Calendar, Star, ShoppingCart, Eye, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--secondary))", "hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b", "#ef4444"];

const AdminAnalytics = () => {
  const { data: bookings = [] } = useQuery({
    queryKey: ["analytics-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["analytics-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("rating, status");
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = bookings.reduce((s, b) => s + Number(b.total_price), 0);
  const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  // Bookings by source
  const sourceMap: Record<string, number> = {};
  bookings.forEach((b) => {
    const src = b.booking_source || "direct";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  // Bookings by status
  const statusMap: Record<string, number> = {};
  bookings.forEach((b) => {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // Monthly revenue
  const monthlyRevenue: Record<string, number> = {};
  bookings.forEach((b) => {
    const month = new Date(b.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(b.total_price);
  });
  const monthlyData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your business performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`AED ${totalRevenue.toLocaleString()}`} icon={DollarSign} change="+15.3%" changeType="positive" />
          <StatCard title="Avg Booking Value" value={`AED ${Math.round(avgBookingValue).toLocaleString()}`} icon={ShoppingCart} change="+4.2%" changeType="positive" animationDelay={50} />
          <StatCard title="Confirmed Bookings" value={confirmedBookings} icon={Calendar} change={`${bookings.length} total`} changeType="neutral" animationDelay={100} />
          <StatCard title="Avg Rating" value={avgRating.toFixed(1)} icon={Star} change={`${reviews.length} reviews`} changeType="positive" animationDelay={150} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <SalesChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-secondary" /> Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => `AED ${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Booking Sources Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" /> Booking Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitorsChart />
          <CustomerRetentionChart />
        </div>

        {/* Booking Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusData.map((s, i) => (
                <div key={s.name} className="text-center p-4 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold" style={{ color: COLORS[i % COLORS.length] }}>{s.value}</p>
                  <p className="text-sm text-muted-foreground capitalize">{s.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
