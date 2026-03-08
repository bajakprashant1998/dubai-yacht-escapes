import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Search, Eye, Calendar, DollarSign, Copy } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const GroupTrips = () => {
  const [search, setSearch] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["admin-group-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: members = [] } = useQuery({
    queryKey: ["admin-group-members", selectedTrip],
    queryFn: async () => {
      if (!selectedTrip) return [];
      const { data, error } = await supabase
        .from("group_trip_members")
        .select("*")
        .eq("group_trip_id", selectedTrip);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTrip,
  });

  const { data: items = [] } = useQuery({
    queryKey: ["admin-group-items", selectedTrip],
    queryFn: async () => {
      if (!selectedTrip) return [];
      const { data, error } = await supabase
        .from("group_trip_items")
        .select("*")
        .eq("group_trip_id", selectedTrip);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTrip,
  });

  const filtered = trips.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.creator_name.toLowerCase().includes(search.toLowerCase()) ||
      t.creator_email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTripData = trips.find((t) => t.id === selectedTrip);
  const totalCost = items.reduce((s, i) => s + Number(i.price_per_person) * i.quantity, 0);

  const statusColor = (s: string) => {
    switch (s) {
      case "active": return "default";
      case "completed": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Group Trips</h1>
          <p className="text-muted-foreground">Manage group trip bookings and cost splits</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{trips.length}</p>
                  <p className="text-sm text-muted-foreground">Total Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{trips.filter((t) => t.status === "active").length}</p>
                  <p className="text-sm text-muted-foreground">Active Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{trips.filter((t) => t.status === "completed").length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Group Trips</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search trips..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip Name</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Share Code</TableHead>
                    <TableHead>Trip Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{trip.creator_name}</p>
                          <p className="text-xs text-muted-foreground">{trip.creator_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 font-mono text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(trip.share_code);
                            toast({ title: "Copied", description: "Share code copied" });
                          }}
                        >
                          {trip.share_code} <Copy className="w-3 h-3" />
                        </Button>
                      </TableCell>
                      <TableCell>{trip.trip_date ? format(new Date(trip.trip_date), "MMM d, yyyy") : "—"}</TableCell>
                      <TableCell><Badge variant={statusColor(trip.status)}>{trip.status}</Badge></TableCell>
                      <TableCell>{format(new Date(trip.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTrip(trip.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No group trips found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Trip Detail Dialog */}
        <Dialog open={!!selectedTrip} onOpenChange={(o) => !o && setSelectedTrip(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTripData?.name || "Trip Details"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Members */}
              <div>
                <h3 className="font-semibold mb-2">Members ({members.length})</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Owed</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="flex items-center gap-2">
                          {m.name}
                          {m.is_organizer && <Badge variant="secondary" className="text-xs">Organizer</Badge>}
                        </TableCell>
                        <TableCell>{m.email}</TableCell>
                        <TableCell>AED {Number(m.amount_owed).toLocaleString()}</TableCell>
                        <TableCell>AED {Number(m.amount_paid).toLocaleString()}</TableCell>
                        <TableCell><Badge variant={m.payment_status === "paid" ? "default" : "outline"}>{m.payment_status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Activities ({items.length})</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price/Person</TableHead>
                      <TableHead>Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>{i.title}</TableCell>
                        <TableCell><Badge variant="outline">{i.item_type}</Badge></TableCell>
                        <TableCell>AED {Number(i.price_per_person).toLocaleString()}</TableCell>
                        <TableCell>{i.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 text-right font-semibold text-lg">
                  Total: AED {totalCost.toLocaleString()}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default GroupTrips;
