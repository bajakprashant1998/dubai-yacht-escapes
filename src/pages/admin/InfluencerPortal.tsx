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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Instagram, Search, Users, TrendingUp, Eye, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const InfluencerPortal = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: influencers = [], isLoading } = useQuery({
    queryKey: ["admin-influencers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("influencer_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["admin-influencer-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("influencer_campaigns")
        .select("*, influencer_applications(full_name, social_handle)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === "approved") {
        const { data: { user } } = await supabase.auth.getUser();
        updates.approved_by = user?.id;
        updates.approved_at = new Date().toISOString();
      }
      const { error } = await supabase.from("influencer_applications").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-influencers"] });
      toast({ title: "Influencer status updated" });
    },
  });

  const filtered = influencers.filter((i) => {
    const matchSearch = i.full_name.toLowerCase().includes(search.toLowerCase()) || i.social_handle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalReach = campaigns.reduce((s, c) => s + (c.estimated_reach || 0), 0);
  const totalROI = campaigns.reduce((s, c) => s + Number(c.roi_value || 0), 0);

  const platformIcon = (p: string) => {
    switch (p) {
      case "instagram": return "📸";
      case "tiktok": return "🎵";
      case "youtube": return "▶️";
      default: return "🌐";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Influencer Portal</h1>
          <p className="text-muted-foreground">Manage influencer partnerships, campaigns, and ROI tracking</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Instagram className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{influencers.length}</p><p className="text-sm text-muted-foreground">Total Influencers</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{influencers.filter((i) => i.status === "approved").length}</p><p className="text-sm text-muted-foreground">Approved</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{totalReach.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Reach</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">AED {totalROI.toLocaleString()}</p><p className="text-sm text-muted-foreground">ROI Value</p></div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="applications">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns ({campaigns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle>Influencer Applications</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Handle</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((inf) => (
                        <TableRow key={inf.id}>
                          <TableCell className="font-medium">{inf.full_name}</TableCell>
                          <TableCell>{platformIcon(inf.social_platform)} {inf.social_platform}</TableCell>
                          <TableCell className="font-mono text-sm">@{inf.social_handle}</TableCell>
                          <TableCell>{inf.followers_count.toLocaleString()}</TableCell>
                          <TableCell>{Number(inf.engagement_rate).toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant={inf.status === "approved" ? "default" : inf.status === "rejected" ? "destructive" : "outline"}>
                              {inf.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(inf.created_at), "MMM d, yyyy")}</TableCell>
                          <TableCell className="flex gap-1">
                            {inf.status === "pending" && (
                              <>
                                <Button size="icon" variant="ghost" className="text-green-600" onClick={() => updateStatus.mutate({ id: inf.id, status: "approved" })}>
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-red-600" onClick={() => updateStatus.mutate({ id: inf.id, status: "rejected" })}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => setSelectedInfluencer(inf)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No applications found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader><CardTitle>Campaign Tracking</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reach</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>ROI</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c: any) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.campaign_name}</TableCell>
                        <TableCell>{c.influencer_applications?.full_name || "—"}</TableCell>
                        <TableCell>{c.booking_date ? format(new Date(c.booking_date), "MMM d") : "—"}</TableCell>
                        <TableCell>{(c.estimated_reach || 0).toLocaleString()}</TableCell>
                        <TableCell>{(c.engagement_count || 0).toLocaleString()}</TableCell>
                        <TableCell>AED {Number(c.roi_value || 0).toLocaleString()}</TableCell>
                        <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                    {campaigns.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No campaigns yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={!!selectedInfluencer} onOpenChange={(o) => !o && setSelectedInfluencer(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{selectedInfluencer?.full_name}</DialogTitle></DialogHeader>
            {selectedInfluencer && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-muted-foreground">Email</p><p>{selectedInfluencer.email}</p></div>
                  <div><p className="text-muted-foreground">Phone</p><p>{selectedInfluencer.phone || "—"}</p></div>
                  <div><p className="text-muted-foreground">Platform</p><p>{selectedInfluencer.social_platform}</p></div>
                  <div><p className="text-muted-foreground">Handle</p><p>@{selectedInfluencer.social_handle}</p></div>
                  <div><p className="text-muted-foreground">Followers</p><p>{selectedInfluencer.followers_count.toLocaleString()}</p></div>
                  <div><p className="text-muted-foreground">Engagement</p><p>{Number(selectedInfluencer.engagement_rate).toFixed(1)}%</p></div>
                  <div><p className="text-muted-foreground">Niche</p><p>{selectedInfluencer.niche}</p></div>
                </div>
                {selectedInfluencer.bio && <div><p className="text-muted-foreground mb-1">Bio</p><p>{selectedInfluencer.bio}</p></div>}
                {selectedInfluencer.portfolio_url && (
                  <div><p className="text-muted-foreground mb-1">Portfolio</p><a href={selectedInfluencer.portfolio_url} target="_blank" className="text-primary underline">{selectedInfluencer.portfolio_url}</a></div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default InfluencerPortal;
