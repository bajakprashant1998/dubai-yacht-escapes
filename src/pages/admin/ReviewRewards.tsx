import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Gift, Star, TrendingUp, Search } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ReviewRewards = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["admin-review-rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_rewards")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalPoints = rewards.reduce((s, r) => s + r.points_earned, 0);
  const redeemed = rewards.filter((r) => r.is_redeemed).length;
  const uniqueBadges = new Set(rewards.filter((r) => r.badge_name).map((r) => r.badge_name)).size;

  const markRedeemed = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("review_rewards")
        .update({ is_redeemed: true, redeemed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-review-rewards"] });
      toast({ title: "Reward marked as redeemed" });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Review Rewards</h1>
          <p className="text-muted-foreground">Manage gamified review rewards, badges, and discount credits</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Star className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{rewards.length}</p><p className="text-sm text-muted-foreground">Total Rewards</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p><p className="text-sm text-muted-foreground">Points Issued</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Gift className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{redeemed}</p><p className="text-sm text-muted-foreground">Redeemed</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-primary" />
            <div><p className="text-2xl font-bold">{uniqueBadges}</p><p className="text-sm text-muted-foreground">Badges Awarded</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Rewards</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Discount Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><Badge variant="outline">{r.reward_type}</Badge></TableCell>
                      <TableCell className="font-semibold">+{r.points_earned}</TableCell>
                      <TableCell>{r.badge_name || "—"}</TableCell>
                      <TableCell className="font-mono text-xs">{r.discount_code || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={r.is_redeemed ? "secondary" : "default"}>
                          {r.is_redeemed ? "Redeemed" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {!r.is_redeemed && (
                          <Button size="sm" variant="outline" onClick={() => markRedeemed.mutate(r.id)}>
                            Mark Redeemed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {rewards.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No rewards yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ReviewRewards;
