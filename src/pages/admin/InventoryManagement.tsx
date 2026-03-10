import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Search, Plus, Package, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const AdminInventoryManagement = () => {
  const queryClient = useQueryClient();
  const [selectedTour, setSelectedTour] = useState<string>("all");
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [editSlot, setEditSlot] = useState<any>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({ tour_id: "", date: "", slots_total: 20, special_price: "" });

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: tours = [] } = useQuery({
    queryKey: ["inventory-tours"],
    queryFn: async () => {
      const { data } = await supabase.from("tours").select("id, title").eq("status", "active").order("title");
      return data || [];
    },
  });

  const { data: availability = [] } = useQuery({
    queryKey: ["inventory-availability", format(weekStart, "yyyy-MM-dd"), selectedTour],
    queryFn: async () => {
      let query = supabase
        .from("tour_availability")
        .select("*")
        .gte("date", format(weekStart, "yyyy-MM-dd"))
        .lte("date", format(weekEnd, "yyyy-MM-dd"))
        .order("date");
      if (selectedTour !== "all") query = query.eq("tour_id", selectedTour);
      const { data } = await query;
      return data || [];
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["inventory-services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("id, title").eq("is_active", true).order("title");
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (slot: any) => {
      const { error } = await supabase.from("tour_availability").update({
        slots_total: slot.slots_total,
        slots_booked: slot.slots_booked,
        is_available: slot.is_available,
        special_price: slot.special_price || null,
      }).eq("id", slot.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-availability"] });
      setEditSlot(null);
      toast.success("Slot updated");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (slot: any) => {
      const { error } = await supabase.from("tour_availability").insert({
        tour_id: slot.tour_id || null,
        date: slot.date,
        slots_total: slot.slots_total,
        special_price: slot.special_price ? Number(slot.special_price) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-availability"] });
      setAddDialog(false);
      setNewSlot({ tour_id: "", date: "", slots_total: 20, special_price: "" });
      toast.success("Availability slot created");
    },
  });

  const stats = useMemo(() => {
    const total = availability.length;
    const fullyBooked = availability.filter(a => a.slots_booked >= a.slots_total).length;
    const lowStock = availability.filter(a => a.slots_total - a.slots_booked <= 3 && a.slots_booked < a.slots_total).length;
    const totalCapacity = availability.reduce((s, a) => s + a.slots_total, 0);
    const totalBooked = availability.reduce((s, a) => s + a.slots_booked, 0);
    return { total, fullyBooked, lowStock, totalCapacity, totalBooked, utilization: totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0 };
  }, [availability]);

  const getTourName = (tourId: string | null) => {
    if (!tourId) return "General";
    return tours.find(t => t.id === tourId)?.title || "Unknown";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-sm text-muted-foreground">Real-time slot & capacity tracking per tour per day</p>
          </div>
          <Button onClick={() => setAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Slot
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Slots", value: stats.total, icon: Package },
            { label: "Utilization", value: `${stats.utilization}%`, icon: CheckCircle },
            { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle },
            { label: "Fully Booked", value: stats.fullyBooked, icon: Calendar },
          ].map((s) => (
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedTour} onValueChange={setSelectedTour}>
            <SelectTrigger className="w-full sm:w-[250px]"><SelectValue placeholder="Filter by tour" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tours</SelectItem>
              {tours.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {format(weekStart, "MMM d")} — {format(weekEnd, "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Week Grid */}
        <Card className="border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Tour</TableHead>
                {weekDays.map(d => (
                  <TableHead key={d.toISOString()} className="text-center min-w-[100px]">
                    <div className="text-xs">{format(d, "EEE")}</div>
                    <div className="font-bold">{format(d, "d")}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.filter(t => selectedTour === "all" || t.id === selectedTour).map(tour => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium text-sm">{tour.title}</TableCell>
                  {weekDays.map(day => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const slot = availability.find(a => a.tour_id === tour.id && a.date === dateStr);
                    const remaining = slot ? slot.slots_total - slot.slots_booked : null;
                    const isFull = remaining !== null && remaining <= 0;
                    const isLow = remaining !== null && remaining <= 3 && !isFull;
                    return (
                      <TableCell key={dateStr} className="text-center p-1">
                        {slot ? (
                          <button
                            onClick={() => setEditSlot({ ...slot })}
                            className={`w-full rounded-lg p-2 text-xs transition-colors ${
                              isFull ? "bg-destructive/10 text-destructive" :
                              isLow ? "bg-amber-500/10 text-amber-600" :
                              "bg-emerald-500/10 text-emerald-600"
                            } hover:opacity-80`}
                          >
                            <div className="font-bold">{remaining}/{slot.slots_total}</div>
                            {slot.special_price && <div className="text-[10px]">AED {slot.special_price}</div>}
                          </button>
                        ) : (
                          <button
                            onClick={() => { setNewSlot(s => ({ ...s, tour_id: tour.id, date: dateStr })); setAddDialog(true); }}
                            className="w-full rounded-lg p-2 text-xs text-muted-foreground hover:bg-muted/40 transition-colors"
                          >
                            —
                          </button>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {tours.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No tours found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Slot Dialog */}
        <Dialog open={!!editSlot} onOpenChange={() => setEditSlot(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Availability — {editSlot?.date}</DialogTitle></DialogHeader>
            {editSlot && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Slots</Label>
                    <Input type="number" value={editSlot.slots_total} onChange={e => setEditSlot({ ...editSlot, slots_total: +e.target.value })} />
                  </div>
                  <div>
                    <Label>Booked</Label>
                    <Input type="number" value={editSlot.slots_booked} onChange={e => setEditSlot({ ...editSlot, slots_booked: +e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Special Price (AED)</Label>
                  <Input type="number" value={editSlot.special_price || ""} onChange={e => setEditSlot({ ...editSlot, special_price: e.target.value ? +e.target.value : null })} placeholder="Leave empty for default" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editSlot.is_available} onCheckedChange={v => setEditSlot({ ...editSlot, is_available: v })} />
                  <Label>Available</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditSlot(null)}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate(editSlot)} disabled={updateMutation.isPending}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Slot Dialog */}
        <Dialog open={addDialog} onOpenChange={setAddDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Availability Slot</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tour</Label>
                <Select value={newSlot.tour_id} onValueChange={v => setNewSlot(s => ({ ...s, tour_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select tour" /></SelectTrigger>
                  <SelectContent>
                    {tours.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={newSlot.date} onChange={e => setNewSlot(s => ({ ...s, date: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Slots</Label>
                  <Input type="number" value={newSlot.slots_total} onChange={e => setNewSlot(s => ({ ...s, slots_total: +e.target.value }))} />
                </div>
                <div>
                  <Label>Special Price (AED)</Label>
                  <Input value={newSlot.special_price} onChange={e => setNewSlot(s => ({ ...s, special_price: e.target.value }))} placeholder="Optional" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate(newSlot)} disabled={createMutation.isPending || !newSlot.tour_id || !newSlot.date}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInventoryManagement;
