import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/admin/StatCard";
import VisitorsChart from "@/components/admin/VisitorsChart";
import SalesChart from "@/components/admin/SalesChart";
import OverviewCard from "@/components/admin/OverviewCard";
import ToursTable from "@/components/admin/ToursTable";
import RevenueChart from "@/components/admin/RevenueChart";
import DiscountUsageChart from "@/components/admin/DiscountUsageChart";
import CustomerRetentionChart from "@/components/admin/CustomerRetentionChart";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { DashboardStatsSkeleton, ChartSkeleton, TableSkeleton } from "@/components/admin/AdminSkeletons";
import { withTimeout } from "@/lib/withTimeout";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  Eye,
  Ship,
  Star,
  FileText,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";
import { format } from "date-fns";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalInquiries: number;
  newInquiries: number;
  totalRevenue: number;
  totalTours: number;
  totalReviews: number;
  recentBookings: any[];
  todayBookings: number;
}

const QuickAction = ({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(href)}
      className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/80 transition-colors text-left w-full group"
    >
      <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

const LiveCounter = ({ label, value, pulse }: { label: string; value: number; pulse?: boolean }) => (
  <div className="flex items-center gap-2">
    {pulse && <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" /></span>}
    <span className="text-xs text-muted-foreground">{label}:</span>
    <span className="text-sm font-bold text-foreground">{value}</span>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0, pendingBookings: 0, confirmedBookings: 0,
    totalInquiries: 0, newInquiries: 0, totalRevenue: 0,
    totalTours: 0, totalReviews: 0, recentBookings: [], todayBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => { fetchDashboardData(); }, []);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
      setLastRefreshed(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoadError(null);
    try {
      const [bookingsRes, inquiriesRes, toursRes, reviewsRes] = await Promise.all([
        withTimeout(supabase.from("bookings").select("*").order("created_at", { ascending: false }), 8000, "Bookings timed out"),
        withTimeout(supabase.from("inquiries").select("status"), 8000, "Inquiries timed out"),
        withTimeout(supabase.from("tours").select("id", { count: "exact", head: true }), 8000, "Tours timed out"),
        withTimeout(supabase.from("reviews").select("id", { count: "exact", head: true }), 8000, "Reviews timed out"),
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (inquiriesRes.error) throw inquiriesRes.error;

      const bookings = bookingsRes.data || [];
      const inquiries = inquiriesRes.data || [];
      const today = format(new Date(), "yyyy-MM-dd");

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
        totalRevenue: bookings.reduce((sum, b) => sum + Number(b.total_price), 0),
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter((i) => i.status === "new").length,
        totalTours: toursRes.count || 0,
        totalReviews: reviewsRes.count || 0,
        recentBookings: bookings.slice(0, 5),
        todayBookings: bookings.filter((b) => b.created_at?.startsWith(today)).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoadError("Couldn't load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => { setLoading(true); fetchDashboardData(); };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="space-y-1"><div className="h-8 w-32 bg-muted rounded animate-pulse" /><div className="h-4 w-64 bg-muted rounded animate-pulse" /></div>
          <DashboardStatsSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><ChartSkeleton /><ChartSkeleton /></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2"><TableSkeleton rows={4} columns={5} /></div><ChartSkeleton /></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {loadError && (
          <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
            <div><p className="font-medium text-foreground">Dashboard data unavailable</p><p className="text-sm text-muted-foreground">{loadError}</p></div>
            <Button variant="outline" onClick={handleRetry}>Retry</Button>
          </div>
        )}

        {/* Header with live indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2">
              <LiveCounter label="Today" value={stats.todayBookings} pulse />
              <LiveCounter label="Pending" value={stats.pendingBookings} />
              <LiveCounter label="New Inquiries" value={stats.newInquiries} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => { fetchDashboardData(); setLastRefreshed(new Date()); }} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`AED ${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} change="+15.3%" changeType="positive" subtitle="Since last month" viewReportLink="/admin/analytics" animationDelay={0} />
          <StatCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} change="+8.2%" changeType="positive" subtitle="Since last month" viewReportLink="/admin/bookings" animationDelay={50} />
          <StatCard title="Active Tours" value={stats.totalTours} icon={Ship} change="Live" changeType="neutral" viewReportLink="/admin/tours" animationDelay={100} />
          <StatCard title="Total Reviews" value={stats.totalReviews} icon={Star} change="All time" changeType="neutral" viewReportLink="/admin/reviews" animationDelay={150} />
        </div>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Zap className="w-4 h-4 text-secondary" /> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <QuickAction icon={Ship} label="Add New Tour" href="/admin/tours/add" />
              <QuickAction icon={Calendar} label="View Bookings" href="/admin/bookings" />
              <QuickAction icon={MessageSquare} label="Check Inquiries" href="/admin/inquiries" />
              <QuickAction icon={FileText} label="View Reports" href="/admin/reports" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings Timeline */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Bookings</CardTitle>
              <span className="text-xs text-muted-foreground">Updated {format(lastRefreshed, "h:mm a")}</span>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${b.status === "confirmed" ? "bg-emerald-500" : b.status === "pending" ? "bg-amber-500" : "bg-rose-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{b.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{b.tour_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">AED {Number(b.total_price).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(b.created_at), "MMM d")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitorsChart />
          <SalesChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <div className="grid grid-cols-1 gap-6">
            <DiscountUsageChart />
            <CustomerRetentionChart />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ToursTable /></div>
          <div className="space-y-6">
            <ActivityFeed />
            <OverviewCard />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Pending Bookings" value={stats.pendingBookings} icon={Calendar} change={stats.pendingBookings > 0 ? "Action needed" : "All clear"} changeType={stats.pendingBookings > 0 ? "negative" : "positive"} animationDelay={0} />
          <StatCard title="Total Inquiries" value={stats.totalInquiries} icon={MessageSquare} change={`${stats.newInquiries} new`} changeType={stats.newInquiries > 0 ? "negative" : "neutral"} animationDelay={50} />
          <StatCard title="Confirmed Bookings" value={stats.confirmedBookings} icon={TrendingUp} change="All time" changeType="positive" animationDelay={100} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
