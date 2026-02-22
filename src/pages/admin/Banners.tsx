import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminBanners, useBannerMutations, Banner } from "@/hooks/useBanners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const defaultBanner: Partial<Banner> = {
  title: "",
  subtitle: "",
  link_url: "",
  link_text: "Learn More",
  bg_color: "#1a1a2e",
  text_color: "#ffffff",
  position: "homepage_top",
  is_active: true,
  sort_order: 0,
};

const AdminBanners = () => {
  const { data: banners = [], isLoading } = useAdminBanners();
  const { create, update, remove } = useBannerMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Banner>>(defaultBanner);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await update.mutateAsync(editing as any);
        toast.success("Banner updated");
      } else {
        await create.mutateAsync(editing);
        toast.success("Banner created");
      }
      setDialogOpen(false);
      setEditing(defaultBanner);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await remove.mutateAsync(id);
    toast.success("Banner deleted");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Promotional Banners</h1>
            <p className="text-muted-foreground">Manage homepage promotions and announcements</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(defaultBanner)} className="gap-2">
                <Plus className="w-4 h-4" /> Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing.id ? "Edit Banner" : "Create Banner"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="🎉 Summer Sale - 30% OFF" />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} placeholder="Limited time offer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Link URL</Label>
                    <Input value={editing.link_url || ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} placeholder="/tours" />
                  </div>
                  <div>
                    <Label>Link Text</Label>
                    <Input value={editing.link_text || ""} onChange={(e) => setEditing({ ...editing, link_text: e.target.value })} placeholder="Shop Now" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <input type="color" value={editing.bg_color || "#1a1a2e"} onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })} className="w-10 h-10 rounded border" />
                      <Input value={editing.bg_color || ""} onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <input type="color" value={editing.text_color || "#ffffff"} onChange={(e) => setEditing({ ...editing, text_color: e.target.value })} className="w-10 h-10 rounded border" />
                      <Input value={editing.text_color || ""} onChange={(e) => setEditing({ ...editing, text_color: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Starts At</Label>
                    <Input type="datetime-local" value={editing.starts_at ? editing.starts_at.slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                  </div>
                  <div>
                    <Label>Expires At</Label>
                    <Input type="datetime-local" value={editing.expires_at ? editing.expires_at.slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                  <Label>Active</Label>
                </div>
                <Button onClick={handleSave} className="w-full" disabled={!editing.title}>
                  {editing.id ? "Update" : "Create"} Banner
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Preview */}
        {editing.title && dialogOpen && (
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: editing.bg_color || "#1a1a2e", color: editing.text_color || "#fff" }}>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="font-semibold">{editing.title}</span>
              {editing.link_text && <span className="text-sm font-medium underline">{editing.link_text}</span>}
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              No banners yet. Create your first one!
            </div>
          ) : (
            banners.map((b) => (
              <div key={b.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: b.bg_color }} />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{b.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={b.is_active ? "text-green-600" : "text-muted-foreground"}>
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                      {b.expires_at && <span>Expires {format(new Date(b.expires_at), "MMM d, yyyy")}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(b); setDialogOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
