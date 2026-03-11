import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Trash2, Copy, Check, Calendar, DollarSign, UserPlus,
  ShoppingBag, Mail, Phone, MapPin, Sparkles, ArrowRight, Share2,
  Globe, PartyPopper, Compass, Ship, ChevronRight
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroupTrip, useCreateGroupTrip } from "@/hooks/useGroupTrip";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";

/* ─── Animation variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── How-It-Works Steps ─── */
const steps = [
  { icon: Users, title: "Create Your Group", desc: "Name your trip & set a date" },
  { icon: Compass, title: "Add Activities", desc: "Browse tours & experiences" },
  { icon: DollarSign, title: "Auto-Split Costs", desc: "Fair per-person calculation" },
  { icon: PartyPopper, title: "Share & Enjoy", desc: "One link, the whole group" },
];

/* ─── Entry ─── */
const GroupTripPage = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  if (!shareCode) return <CreateGroupTrip />;
  return <ViewGroupTrip shareCode={shareCode} />;
};

/* ═══════════════════════════════════════════════════════
   CREATE GROUP TRIP
   ═══════════════════════════════════════════════════════ */
const CreateGroupTrip = () => {
  const navigate = useNavigate();
  const createTrip = useCreateGroupTrip();
  const [form, setForm] = useState({
    name: "", creator_name: "", creator_email: "", creator_phone: "", trip_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trip = await createTrip.mutateAsync({
      ...form,
      trip_date: form.trip_date || undefined,
      creator_phone: form.creator_phone || undefined,
    });
    navigate(`/group-trip/${trip.share_code}`);
  };

  const isValid = form.name && form.creator_name && form.creator_email;

  return (
    <Layout>
      <SEOHead
        title="Create Group Trip | Betterview Tourism"
        description="Plan a group trip to Dubai and split costs with friends and family."
      />

      {/* ── Navy Hero ── */}
      <section className="relative bg-navy-gradient overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

        <div className="container max-w-5xl relative py-16 sm:py-24 lg:py-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-secondary/15 text-secondary border-secondary/25 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm mb-5 inline-flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5" /> Smart Group Splitter
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-fluid-3xl font-bold text-primary-foreground leading-tight"
            >
              Plan Together,{" "}
              <span className="text-shimmer">Split Fairly</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-primary-foreground/70 text-lg sm:text-xl mt-5 max-w-2xl mx-auto leading-relaxed"
            >
              Create a shared trip, invite your group, add activities — costs split automatically.
              No sign-up required, just share a link.
            </motion.p>
          </motion.div>

          {/* How it works */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-foreground/10 group-hover:border-secondary/30 transition-all duration-300">
                  <step.icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="absolute -top-1.5 left-1/2 translate-x-3 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-secondary/30">
                  {i + 1}
                </span>
                <h3 className="font-display font-semibold text-sm text-primary-foreground">{step.title}</h3>
                <p className="text-xs text-primary-foreground/50 mt-0.5">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-6 -right-3 w-5 h-5 text-primary-foreground/15" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="relative -mt-10 pb-16 sm:pb-24">
        <div className="container max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="card-elevated rounded-xl bg-card border-border/60 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="w-5 h-5 text-secondary" />
                  Create Your Group Trip
                </CardTitle>
                <p className="text-sm text-muted-foreground">Fill in the details to get started</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Trip Name
                    </label>
                    <Input
                      placeholder="e.g. Dubai Adventure 2026"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" /> Your Name
                      </label>
                      <Input placeholder="John Doe" value={form.creator_name} onChange={(e) => setForm({ ...form, creator_name: e.target.value })} required className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
                      </label>
                      <Input type="email" placeholder="john@example.com" value={form.creator_email} onChange={(e) => setForm({ ...form, creator_email: e.target.value })} required className="h-11 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone
                        <span className="text-muted-foreground text-xs">(optional)</span>
                      </label>
                      <Input placeholder="+971 50 123 4567" value={form.creator_phone} onChange={(e) => setForm({ ...form, creator_phone: e.target.value })} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Trip Date
                        <span className="text-muted-foreground text-xs">(optional)</span>
                      </label>
                      <Input type="date" value={form.trip_date} onChange={(e) => setForm({ ...form, trip_date: e.target.value })} className="h-11 rounded-xl" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base gap-2 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    size="lg"
                    disabled={createTrip.isPending || !isValid}
                  >
                    {createTrip.isPending ? "Creating..." : (
                      <>Create Group Trip <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    You'll get a shareable link to invite your group — no sign up required!
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

/* ─── Member Avatar ─── */
const MemberAvatar = ({ name, isOrganizer }: { name: string; isOrganizer: boolean }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
      isOrganizer
        ? "bg-secondary text-secondary-foreground ring-2 ring-secondary/30"
        : "bg-muted text-muted-foreground"
    }`}>
      {initials}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   VIEW GROUP TRIP
   ═══════════════════════════════════════════════════════ */
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

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: trip?.name, text: `Join our group trip: ${trip?.name}`, url: shareUrl }); } catch { /* cancelled */ }
    } else { handleCopyLink(); }
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
        <div className="bg-navy-gradient py-16"><div className="container max-w-5xl"><Skeleton className="h-16 w-80 bg-primary-foreground/10" /></div></div>
        <div className="container max-w-5xl py-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
          <div className="grid lg:grid-cols-5 gap-6"><Skeleton className="h-80 lg:col-span-3 rounded-xl" /><Skeleton className="h-80 lg:col-span-2 rounded-xl" /></div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-6">
            <div className="w-20 h-20 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Trip Not Found</h2>
            <p className="text-muted-foreground mb-6">This group trip link may be invalid or expired.</p>
            <Button asChild className="rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link to="/group-trip">Create a New Group Trip</Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const paidMembers = members.filter(m => m.payment_status === "paid").length;
  const progressPercent = members.length > 0 ? (paidMembers / members.length) * 100 : 0;

  return (
    <Layout>
      <SEOHead title={`${trip.name} | Group Trip`} description="View and manage your group trip to Dubai." />

      {/* ── Navy Hero Banner ── */}
      <section className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
        <div className="container max-w-5xl relative py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
          >
            <div>
              <Badge className="mb-3 bg-secondary/15 text-secondary border-secondary/25 backdrop-blur-sm">
                <Users className="w-3 h-3 mr-1" /> Group Trip
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">{trip.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-primary-foreground/60">
                {trip.trip_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-secondary/70" />
                    {new Date(trip.trip_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-secondary/70" /> {members.length} member{members.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-secondary/70" /> {items.length} activit{items.length !== 1 ? "ies" : "y"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button onClick={handleShare} variant="outline" className="gap-2 rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button onClick={handleCopyLink} className="gap-2 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <div className="container max-w-5xl -mt-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { icon: Users, label: "Members", value: String(members.length), color: "text-secondary" },
            { icon: ShoppingBag, label: "Activities", value: String(items.length), color: "text-secondary" },
            { icon: DollarSign, label: "Total Cost", value: `AED ${totalCost.toLocaleString()}`, color: "text-secondary" },
            { icon: DollarSign, label: "Per Person", value: `AED ${Math.round(perPersonCost).toLocaleString()}`, color: "text-secondary", highlight: true },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className={`card-elevated card-shine rounded-xl bg-card ${stat.highlight ? "border-secondary/30 ring-1 ring-secondary/10" : "border-border/60"}`}>
                <CardContent className="py-4 sm:py-5 flex items-center gap-3 sm:gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.highlight ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>
                    <stat.icon className={`w-5 h-5 ${stat.highlight ? "" : stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-lg sm:text-xl font-bold truncate ${stat.highlight ? "text-secondary" : "text-foreground"}`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <div className="container max-w-5xl py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="grid lg:grid-cols-5 gap-6">

            {/* Left: Tabs */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="members" className="w-full">
                <TabsList className="w-full grid grid-cols-2 rounded-xl h-12 bg-muted p-1">
                  <TabsTrigger value="members" className="gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    <Users className="w-4 h-4" /> Members ({members.length})
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="gap-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    <ShoppingBag className="w-4 h-4" /> Activities ({items.length})
                  </TabsTrigger>
                </TabsList>

                {/* ── Members Tab ── */}
                <TabsContent value="members" className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">People joining this trip</p>
                    <Button size="sm" variant="outline" onClick={() => setShowAddMember(!showAddMember)} className="gap-1.5 rounded-xl">
                      <UserPlus className="w-4 h-4" /> Add Member
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showAddMember && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Card className="card-elevated rounded-xl border-secondary/30">
                          <CardContent className="pt-4 pb-4">
                            <form onSubmit={handleAddMember} className="space-y-3">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <Input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} required className="rounded-xl" />
                                <Input placeholder="Email" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} required className="rounded-xl" />
                              </div>
                              <div className="flex gap-3">
                                <Input placeholder="Phone (optional)" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className="flex-1 rounded-xl" />
                                <Button type="submit" className="gap-1.5 shrink-0 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                                  <Plus className="w-4 h-4" /> Add
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {members.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-card card-elevated hover:border-secondary/20 transition-all"
                      >
                        <MemberAvatar name={member.name} isOrganizer={member.is_organizer} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-semibold text-sm text-foreground">{member.name}</span>
                            {member.is_organizer && (
                              <Badge className="text-[10px] h-5 px-1.5 bg-secondary/10 text-secondary border-secondary/20">
                                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Organizer
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3" /> {member.email}</span>
                            {member.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {member.phone}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant={member.payment_status === "paid" ? "default" : "outline"} className={`text-xs rounded-lg ${member.payment_status === "paid" ? "bg-secondary/15 text-secondary border-secondary/20" : ""}`}>
                            {member.payment_status}
                          </Badge>
                          {!member.is_organizer && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeMember(member.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {members.length === 0 && (
                      <div className="text-center py-14 text-muted-foreground">
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 opacity-30" />
                        </div>
                        <p className="font-display font-semibold text-foreground">No members yet</p>
                        <p className="text-sm mt-1">Add friends and family to your group</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* ── Activities Tab ── */}
                <TabsContent value="activities" className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Activities & experiences in this trip</p>
                    <Button size="sm" variant="outline" asChild className="gap-1.5 rounded-xl">
                      <Link to="/tours"><Plus className="w-4 h-4" /> Browse Tours</Link>
                    </Button>
                  </div>

                  {items.length === 0 ? (
                    <Card className="card-elevated rounded-xl border-dashed border-2 border-border">
                      <CardContent className="py-14 text-center">
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                          <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-1">No activities added yet</h3>
                        <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                          Browse our tours and services to add amazing experiences to your group trip
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button asChild variant="outline" className="gap-1.5 rounded-xl">
                            <Link to="/tours"><ShoppingBag className="w-4 h-4" /> Tours</Link>
                          </Button>
                          <Button asChild className="gap-1.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                            <Link to="/services"><Sparkles className="w-4 h-4" /> Experiences</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="group flex items-center gap-3 p-3 rounded-xl bg-card card-elevated hover:border-secondary/20 transition-all"
                        >
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-semibold text-sm text-foreground truncate">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] h-5 rounded-lg">{item.item_type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                AED {Number(item.price_per_person).toLocaleString()} × {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-display font-bold text-sm text-foreground">
                              AED {(Number(item.price_per_person) * item.quantity).toLocaleString()}
                            </p>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity mt-1" onClick={() => removeItem(item.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Cost Summary Sidebar */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24 card-elevated rounded-xl bg-card border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 font-display">
                    <DollarSign className="w-5 h-5 text-secondary" /> Cost Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items breakdown */}
                  {items.length > 0 && (
                    <div className="space-y-2.5">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate mr-2">{item.title}</span>
                          <span className="font-medium text-foreground shrink-0">
                            AED {(Number(item.price_per_person) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <Separator />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost</span>
                      <span className="font-bold text-foreground">AED {totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-medium text-foreground">{members.length}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Per Person Highlight */}
                  <div className="bg-navy-gradient rounded-xl p-5 text-center">
                    <p className="text-xs text-primary-foreground/60 mb-1">Each person pays</p>
                    <p className="text-3xl font-display font-bold text-secondary">
                      AED {Math.round(perPersonCost).toLocaleString()}
                    </p>
                    <p className="text-xs text-primary-foreground/50 mt-1">per person</p>
                  </div>

                  {/* Payment Progress */}
                  {members.length > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Payment progress</span>
                        <span>{paidMembers}/{members.length} paid</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Button onClick={handleShare} className="w-full gap-2 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground" size="lg">
                      <Share2 className="w-4 h-4" /> Invite More Friends
                    </Button>
                    <Button asChild variant="outline" className="w-full gap-2 rounded-xl">
                      <Link to="/tours"><Plus className="w-4 h-4" /> Add More Activities</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default GroupTripPage;
