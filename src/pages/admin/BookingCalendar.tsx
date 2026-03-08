import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isSameMonth } from "date-fns";

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-500",
  cancelled: "bg-rose-500",
};

const AdminBookingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const { data: bookings = [] } = useQuery({
    queryKey: ["calendar-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("booking_date");
      if (error) throw error;
      return data;
    },
  });

  const filteredBookings = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, typeof bookings> = {};
    filteredBookings.forEach((b) => {
      const key = b.booking_date;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [filteredBookings]);

  const dayBookings = selectedDay ? bookingsByDate[format(selectedDay, "yyyy-MM-dd")] || [] : [];

  const monthStats = useMemo(() => {
    const monthBookings = filteredBookings.filter((b) => {
      const d = new Date(b.booking_date);
      return isSameMonth(d, currentMonth);
    });
    return {
      total: monthBookings.length,
      revenue: monthBookings.reduce((s, b) => s + Number(b.total_price), 0),
      confirmed: monthBookings.filter((b) => b.status === "confirmed").length,
      pending: monthBookings.filter((b) => b.status === "pending").length,
    };
  }, [filteredBookings, currentMonth]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Booking Calendar</h1>
            <p className="text-sm text-muted-foreground">Visual overview of all bookings by date</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Month stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Bookings", value: monthStats.total },
            { label: "Revenue", value: `AED ${monthStats.revenue.toLocaleString()}` },
            { label: "Confirmed", value: monthStats.confirmed },
            { label: "Pending", value: monthStats.pending },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calendar */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <CardTitle className="text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startPadding }).map((_, i) => <div key={`pad-${i}`} />)}
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const dayB = bookingsByDate[key] || [];
                const isToday = isSameDay(day, new Date());
                return (
                  <button
                    key={key}
                    onClick={() => dayB.length > 0 && setSelectedDay(day)}
                    className={`relative p-2 rounded-lg text-sm min-h-[70px] sm:min-h-[80px] text-left transition-colors ${
                      isToday ? "ring-2 ring-secondary" : ""
                    } ${dayB.length > 0 ? "bg-muted/40 hover:bg-muted/80 cursor-pointer" : "hover:bg-muted/20"}`}
                  >
                    <span className={`text-xs font-medium ${isToday ? "text-secondary" : "text-foreground"}`}>
                      {format(day, "d")}
                    </span>
                    {dayB.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {dayB.slice(0, 2).map((b) => (
                          <div key={b.id} className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[b.status] || "bg-muted"}`} />
                            <span className="text-[10px] text-muted-foreground truncate">{b.customer_name?.split(" ")[0]}</span>
                          </div>
                        ))}
                        {dayB.length > 2 && (
                          <span className="text-[10px] text-secondary font-medium">+{dayB.length - 2} more</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-xs text-muted-foreground capitalize">{status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day detail dialog */}
        <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                {selectedDay && format(selectedDay, "EEEE, MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {dayBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                  <span className={`w-2 h-2 rounded-full ${statusColors[b.status] || "bg-muted"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{b.customer_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.tour_name}</p>
                    <p className="text-xs text-muted-foreground">{b.adults}A {b.children > 0 ? `${b.children}C` : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">AED {Number(b.total_price).toLocaleString()}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                      b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600" :
                      b.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                      "bg-rose-500/10 text-rose-600"
                    }`}>{b.status}</span>
                  </div>
                </div>
              ))}
              {dayBookings.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No bookings</p>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingCalendar;
