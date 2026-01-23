import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalInquiries: number;
  newInquiries: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalInquiries: 0,
    newInquiries: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings stats
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*");

      if (bookingsError) throw bookingsError;

      // Fetch inquiries stats
      const { data: inquiries, error: inquiriesError } = await supabase
        .from("inquiries")
        .select("*");

      if (inquiriesError) throw inquiriesError;

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0;
      const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

      const totalInquiries = inquiries?.length || 0;
      const newInquiries = inquiries?.filter((i) => i.status === "new").length || 0;

      setStats({
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalInquiries,
        newInquiries,
        totalRevenue,
      });

      // Set recent items
      setRecentBookings(bookings?.slice(0, 5) || []);
      setRecentInquiries(inquiries?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `AED ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-secondary",
    },
    {
      title: "Inquiries",
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      title: "New Inquiries",
      value: stats.newInquiries,
      icon: TrendingUp,
      color: "bg-rose-500",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-card rounded-xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">Recent Bookings</h2>
            </div>
            <div className="p-6">
              {recentBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.tour_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">AED {booking.total_price}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : booking.status === "pending"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-card rounded-xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">Recent Inquiries</h2>
            </div>
            <div className="p-6">
              {recentInquiries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No inquiries yet</p>
              ) : (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {inquiry.message}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          inquiry.status === "new"
                            ? "bg-blue-500/10 text-blue-500"
                            : inquiry.status === "responded"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
