import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Search, Users, DollarSign, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const statusOptions = ["inquiry", "proposal_sent", "negotiating", "confirmed", "completed", "cancelled"];

const CorporateEvents = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-corporate-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("corporate_events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("corporate_events").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-corporate-events"] });
      toast({ title: "Status updated" });
    },
  });

  const filtered = events.filter((e) => {
    const matchSearch =
      e.company_name.toLowerCase().includes(search.toLowerCase()) ||
      e.contact_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = events.filter((e) => e.invoice_status === "paid").reduce((s, e) => s + Number(e.invoice_amount), 0);

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": case "completed": return "default";
      case "proposal_sent": case "negotiating": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Corporate Events</h1>
          <p className="text-muted-foreground">Manage B2B corporate bookings, proposals, and invoices</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{events.length}</p><p className="text-sm text-muted-foreground">Total Events</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{events.filter((e) => e.status === "confirmed").length}</p><p className="text-sm text-muted-foreground">Confirmed</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{events.filter((e) => e.status === "inquiry").length}</p><p className="text-sm text-muted-foreground">Pending Inquiries</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">AED {totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Revenue</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle>All Corporate Events</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.company_name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{e.contact_name}</p>
                          <p className="text-xs text-muted-foreground">{e.contact_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{e.event_type.replace("_", " ")}</TableCell>
                      <TableCell>{e.event_date ? format(new Date(e.event_date), "MMM d, yyyy") : "—"}</TableCell>
                      <TableCell>{e.guests_count}</TableCell>
                      <TableCell>
                        <Select value={e.status} onValueChange={(v) => updateStatus.mutate({ id: e.id, status: v })}>
                          <SelectTrigger className="w-32 h-8">
                            <Badge variant={statusColor(e.status)} className="text-xs">{e.status.replace("_", " ")}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {e.invoice_number ? (
                          <div>
                            <p className="text-xs font-mono">{e.invoice_number}</p>
                            <p className="text-xs text-muted-foreground">AED {Number(e.invoice_amount).toLocaleString()}</p>
                          </div>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(e)}>
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No corporate events found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.company_name}</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-muted-foreground">Contact</p><p>{selectedEvent.contact_name}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p>{selectedEvent.contact_email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p>{selectedEvent.contact_phone || "—"}</p></div>
                  <div><p className="text-muted-foreground">Event Type</p><p className="capitalize">{selectedEvent.event_type.replace("_", " ")}</p></div>
                  <div><p className="text-muted-foreground">Guests</p><p>{selectedEvent.guests_count}</p></div>
                  <div><p className="text-muted-foreground">Budget</p><p>{selectedEvent.budget_range || "—"}</p></div>
                </div>
                {selectedEvent.requirements && (
                  <div><p className="text-muted-foreground mb-1">Requirements</p><p>{selectedEvent.requirements}</p></div>
                )}
                {selectedEvent.notes && (
                  <div><p className="text-muted-foreground mb-1">Notes</p><p>{selectedEvent.notes}</p></div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CorporateEvents;
