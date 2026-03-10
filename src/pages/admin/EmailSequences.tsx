import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from "date-fns";
import { Mail, Send, Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { sendBookingEmail } from "@/lib/sendBookingEmail";

const EMAIL_TYPES = [
  { key: "confirmation", label: "Booking Confirmation", icon: CheckCircle, description: "Sent immediately after booking", delay: "Instant" },
  { key: "reminder", label: "Pre-Trip Reminder", icon: Clock, description: "Sent 24h before booking date", delay: "24h before" },
  { key: "review_request", label: "Review Request", icon: Mail, description: "Sent 2 days after trip completion", delay: "2 days after" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  sent: "bg-emerald-500/10 text-emerald-600",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

const AdminEmailSequences = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: scheduledEmails = [], isLoading } = useQuery({
    queryKey: ["email-schedules", statusFilter],
    queryFn: async () => {
      let query = supabase.from("booking_email_schedule").select("*, bookings(customer_name, customer_email, tour_name, booking_date)").order("scheduled_for", { ascending: false }).limit(100);
      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: recentBookings = [] } = useQuery({
    queryKey: ["recent-bookings-for-email"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("id, customer_name, customer_email, tour_name, booking_date, status")
        .in("status", ["confirmed", "pending"])
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
  });

  const scheduleEmailMutation = useMutation({
    mutationFn: async ({ bookingId, emailType, scheduledFor }: { bookingId: string; emailType: string; scheduledFor: string }) => {
      const { error } = await supabase.from("booking_email_schedule").insert({
        booking_id: bookingId,
        email_type: emailType,
        scheduled_for: scheduledFor,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-schedules"] });
      toast.success("Email scheduled");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const sendNowMutation = useMutation({
    mutationFn: async ({ scheduleId, bookingId, emailType }: { scheduleId: string; bookingId: string; emailType: string }) => {
      const result = await sendBookingEmail(bookingId, emailType as any);
      if (result.success) {
        await supabase.from("booking_email_schedule").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", scheduleId);
      } else {
        await supabase.from("booking_email_schedule").update({ status: "failed", error_message: result.error }).eq("id", scheduleId);
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-schedules"] });
      toast.success("Email sent");
    },
    onError: (e: any) => toast.error(`Failed: ${e.message}`),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("booking_email_schedule").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-schedules"] });
      toast.success("Email cancelled");
    },
  });

  const scheduleAllForBooking = (bookingId: string, bookingDate: string) => {
    const now = new Date();
    const bDate = new Date(bookingDate);
    // Confirmation: now
    scheduleEmailMutation.mutate({ bookingId, emailType: "confirmation", scheduledFor: now.toISOString() });
    // Reminder: 24h before
    const reminder = new Date(bDate.getTime() - 24 * 60 * 60 * 1000);
    if (reminder > now) {
      scheduleEmailMutation.mutate({ bookingId, emailType: "reminder", scheduledFor: reminder.toISOString() });
    }
    // Review request: 2 days after
    const review = new Date(bDate.getTime() + 2 * 24 * 60 * 60 * 1000);
    scheduleEmailMutation.mutate({ bookingId, emailType: "review_request", scheduledFor: review.toISOString() });
  };

  const stats = {
    total: scheduledEmails.length,
    pending: scheduledEmails.filter(e => e.status === "pending").length,
    sent: scheduledEmails.filter(e => e.status === "sent").length,
    failed: scheduledEmails.filter(e => e.status === "failed").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Email Sequences</h1>
          <p className="text-sm text-muted-foreground">Automated booking confirmation → reminder → review request</p>
        </div>

        {/* Sequence Flow */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-lg">Email Sequence Flow</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {EMAIL_TYPES.map((type, i) => (
                <div key={type.key} className="flex items-center gap-3 flex-1">
                  <div className="bg-secondary/10 rounded-xl p-3 flex-shrink-0">
                    <type.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.delay}</p>
                  </div>
                  {i < EMAIL_TYPES.length - 1 && <span className="hidden sm:block text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Schedule */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-lg">Quick Schedule — Recent Bookings</CardTitle></CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent bookings</p>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {recentBookings.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{b.tour_name} — {b.booking_date}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => scheduleAllForBooking(b.id, b.booking_date)} disabled={scheduleEmailMutation.isPending}>
                      <Send className="w-3.5 h-3.5 mr-1" /> Schedule All
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Scheduled", value: stats.total, icon: Mail },
            { label: "Pending", value: stats.pending, icon: Clock },
            { label: "Sent", value: stats.sent, icon: CheckCircle },
            { label: "Failed", value: stats.failed, icon: AlertTriangle },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Schedule Table */}
        <Card className="border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Email Type</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledEmails.map(email => (
                <TableRow key={email.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{(email as any).bookings?.customer_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{(email as any).bookings?.customer_email || ""}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{(email as any).bookings?.tour_name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{email.email_type.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(email.scheduled_for), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[email.status]}>{email.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {email.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => sendNowMutation.mutate({ scheduleId: email.id, bookingId: email.booking_id, emailType: email.email_type })} disabled={sendNowMutation.isPending}>
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => cancelMutation.mutate(email.id)}>
                            <XCircle className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </>
                      )}
                      {email.status === "failed" && (
                        <Button size="sm" variant="ghost" onClick={() => sendNowMutation.mutate({ scheduleId: email.id, bookingId: email.booking_id, emailType: email.email_type })}>
                          <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {scheduledEmails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No scheduled emails</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEmailSequences;
