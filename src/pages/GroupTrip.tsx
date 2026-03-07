import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Link2, Plus, Trash2, Share2, Copy, Check, Calendar, DollarSign, UserPlus, ShoppingBag, ArrowLeft, Mail, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGroupTrip, useCreateGroupTrip } from "@/hooks/useGroupTrip";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";

const GroupTripPage = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !shareCode;

  if (isNew) return <CreateGroupTrip />;

  return <ViewGroupTrip shareCode={shareCode!} />;
};

const CreateGroupTrip = () => {
  const navigate = useNavigate();
  const createTrip = useCreateGroupTrip();
  const [form, setForm] = useState({ name: "", creator_name: "", creator_email: "", creator_phone: "", trip_date: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trip = await createTrip.mutateAsync({
      ...form,
      trip_date: form.trip_date || undefined,
      creator_phone: form.creator_phone || undefined,
    });
    navigate(`/group-trip/${trip.share_code}`);
  };

  return (
    <Layout>
      <SEOHead title="Create Group Trip | Betterview Tourism" description="Plan a group trip to Dubai and split costs with friends and family." />
      <div className="min-h-screen bg-background py-12">
        <div className="container max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Start a Group Trip</h1>
              <p className="text-muted-foreground mt-2">Plan together, split costs, share a link</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Trip Name</label>
                    <Input placeholder="Dubai Adventure 2026" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Your Name</label>
                    <Input placeholder="John Doe" value={form.creator_name} onChange={(e) => setForm({ ...form, creator_name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Your Email</label>
                    <Input type="email" placeholder="john@example.com" value={form.creator_email} onChange={(e) => setForm({ ...form, creator_email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone (optional)</label>
                    <Input placeholder="+971 50 123 4567" value={form.creator_phone} onChange={(e) => setForm({ ...form, creator_phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Trip Date (optional)</label>
                    <Input type="date" value={form.trip_date} onChange={(e) => setForm({ ...form, trip_date: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={createTrip.isPending}>
                    <Users className="w-4 h-4 mr-2" />
                    {createTrip.isPending ? "Creating..." : "Create Group Trip"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

const ViewGroupTrip = ({ shareCode }: { shareCode: string }) => {
  const { trip, members, items, totalCost, perPersonCost, isLoading, addMember, removeMember, removeItem } = useGroupTrip(shareCode);
  const { toast } = useToast();
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "" });
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/group-trip/${shareCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Share this with your group." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    addMember({ ...newMember, phone: newMember.phone || undefined });
    setNewMember({ name: "", email: "", phone: "" });
    setShowAddMember(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-12">
          <div className="container max-w-4xl space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Trip not found</h2>
            <p className="text-muted-foreground">This group trip link may be invalid.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title={`${trip.name} | Group Trip`} description="View and manage your group trip to Dubai." />
      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">Group Trip</Badge>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{trip.name}</h1>
                {trip.trip_date && (
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="w-4 h-4" /> {new Date(trip.trip_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
              <Button onClick={handleCopyLink} variant="outline" className="gap-2 shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Share Link"}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="py-4 text-center">
                  <Users className="w-5 h-5 mx-auto text-primary mb-1" />
                  <div className="text-2xl font-bold text-foreground">{members.length}</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 text-center">
                  <ShoppingBag className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <div className="text-2xl font-bold text-foreground">AED {totalCost.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 text-center">
                  <DollarSign className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                  <div className="text-2xl font-bold text-foreground">AED {Math.round(perPersonCost).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Per Person</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Members */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" /> Members ({members.length})
                    </CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddMember(!showAddMember)}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showAddMember && (
                    <form onSubmit={handleAddMember} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <Input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} required className="h-8 text-sm" />
                      <Input placeholder="Email" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} required className="h-8 text-sm" />
                      <Input placeholder="Phone (optional)" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className="h-8 text-sm" />
                      <Button type="submit" size="sm" className="w-full">Add Member</Button>
                    </form>
                  )}
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{member.name}</span>
                          {member.is_organizer && <Badge variant="secondary" className="text-[10px] h-4">Organizer</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <Mail className="w-3 h-3" /> {member.email}
                        </div>
                      </div>
                      {!member.is_organizer && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeMember(member.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Activities / Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Activities ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No activities added yet</p>
                      <p className="text-xs mt-1">Browse tours and services to add to this group trip</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] h-4">{item.item_type}</Badge>
                            <span>AED {item.price_per_person} × {item.quantity}</span>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  )}

                  <Separator />

                  {/* Cost split summary */}
                  <div className="bg-primary/5 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-foreground">AED {totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Per person ({members.length} members)</span>
                      <span className="font-bold text-primary">AED {Math.round(perPersonCost).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default GroupTripPage;
