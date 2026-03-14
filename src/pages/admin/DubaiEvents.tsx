import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Plus, Pencil, Trash2, Eye, EyeOff, Star, Search, Filter
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useDubaiEvents, useCreateDubaiEvent, useUpdateDubaiEvent, useDeleteDubaiEvent,
  DubaiEvent
} from "@/hooks/useDubaiEvents";
import { toast } from "@/hooks/use-toast";

const categories = ["festival", "shopping", "sports", "entertainment", "cultural", "food"];

const emptyEvent: Partial<DubaiEvent> = {
  title: "", slug: "", description: "", event_date: "", end_date: "",
  start_time: "", end_time: "", location: "", venue: "", image_url: "",
  category: "festival", ticket_url: "", price_from: 0, is_free: false,
  is_featured: false, is_active: true, meta_title: "", meta_description: "",
};

const AdminDubaiEvents = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<DubaiEvent> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: events = [], isLoading } = useDubaiEvents({ includeInactive: true });
  const createMutation = useCreateDubaiEvent();
  const updateMutation = useUpdateDubaiEvent();
  const deleteMutation = useDeleteDubaiEvent();

  const filtered = events.filter(e => {
    const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !categoryFilter || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openCreate = () => { setEditing({ ...emptyEvent }); setDialogOpen(true); };
  const openEdit = (e: DubaiEvent) => { setEditing({ ...e }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!editing?.title || !editing?.event_date) {
      toast({ title: "Title and event date are required", variant: "destructive" });
      return;
    }
    const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload = { ...editing, slug };

    if (editing.id) {
      await updateMutation.mutateAsync(payload as DubaiEvent & { id: string });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const toggleActive = async (event: DubaiEvent) => {
    await updateMutation.mutateAsync({ id: event.id, is_active: !event.is_active } as any);
  };

  const toggleFeatured = async (event: DubaiEvent) => {
    await updateMutation.mutateAsync({ id: event.id, is_featured: !event.is_featured } as any);
  };

  const updateField = (field: string, value: any) => {
    setEditing(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dubai Events</h1>
            <p className="text-muted-foreground">Manage events shown on the public events calendar.</p>
          </div>
          <Button onClick={openCreate} className="bg-secondary hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{events.length}</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{events.filter(e => e.is_active).length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{events.filter(e => e.is_featured).length}</div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-500">{events.filter(e => new Date(e.event_date) >= new Date()).length}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent></Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No events found</TableCell></TableRow>
                  ) : filtered.map(event => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {event.image_url && (
                            <img src={event.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                          )}
                          <div>
                            <div className="font-medium text-foreground">{event.title}</div>
                            <div className="text-xs text-muted-foreground">{event.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{event.category}</Badge></TableCell>
                      <TableCell className="text-sm">{new Date(event.event_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{event.location || "—"}</TableCell>
                      <TableCell>
                        <Switch checked={event.is_active} onCheckedChange={() => toggleActive(event)} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(event)}>
                          <Star className={`w-4 h-4 ${event.is_featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(event)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(event.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Title *</Label>
                    <Input value={editing.title || ""} onChange={e => updateField("title", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Slug</Label>
                    <Input value={editing.slug || ""} onChange={e => updateField("slug", e.target.value)} placeholder="auto-generated from title" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={editing.description || ""} onChange={e => updateField("description", e.target.value)} rows={3} />
                  </div>
                  <div>
                    <Label>Event Date *</Label>
                    <Input type="date" value={editing.event_date || ""} onChange={e => updateField("event_date", e.target.value)} />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" value={editing.end_date || ""} onChange={e => updateField("end_date", e.target.value)} />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input value={editing.start_time || ""} onChange={e => updateField("start_time", e.target.value)} placeholder="10:00 AM" />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input value={editing.end_time || ""} onChange={e => updateField("end_time", e.target.value)} placeholder="10:00 PM" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={editing.category || "festival"} onValueChange={v => updateField("category", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Price From (AED)</Label>
                    <Input type="number" value={editing.price_from || 0} onChange={e => updateField("price_from", Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={editing.location || ""} onChange={e => updateField("location", e.target.value)} placeholder="Dubai" />
                  </div>
                  <div>
                    <Label>Venue</Label>
                    <Input value={editing.venue || ""} onChange={e => updateField("venue", e.target.value)} placeholder="Dubai World Trade Centre" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Image URL</Label>
                    <Input value={editing.image_url || ""} onChange={e => updateField("image_url", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Ticket URL</Label>
                    <Input value={editing.ticket_url || ""} onChange={e => updateField("ticket_url", e.target.value)} />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <Switch checked={editing.is_free || false} onCheckedChange={v => updateField("is_free", v)} />
                      <span className="text-sm">Free Event</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch checked={editing.is_featured || false} onCheckedChange={v => updateField("is_featured", v)} />
                      <span className="text-sm">Featured</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch checked={editing.is_active !== false} onCheckedChange={v => updateField("is_active", v)} />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Meta Title</Label>
                    <Input value={editing.meta_title || ""} onChange={e => updateField("meta_title", e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Meta Description</Label>
                    <Textarea value={editing.meta_description || ""} onChange={e => updateField("meta_description", e.target.value)} rows={2} />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button
                    onClick={handleSave}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    {editing.id ? "Update" : "Create"} Event
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Delete Event?</DialogTitle></DialogHeader>
            <p className="text-muted-foreground">This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminDubaiEvents;
