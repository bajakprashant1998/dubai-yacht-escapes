import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Heart, User, MapPin, Clock, DollarSign, LogOut } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/auth");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [navigate]);

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { wishlistItems } = useWishlist();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    confirmed: "bg-green-500/10 text-green-600 border-green-500/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
    completed: "bg-secondary/10 text-secondary border-secondary/30",
  };

  return (
    <Layout>
      <div className="container py-10 lg:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile?.full_name || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border">
            <Calendar className="w-5 h-5 text-secondary mb-2" />
            <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <Heart className="w-5 h-5 text-secondary mb-2" />
            <p className="text-2xl font-bold text-foreground">{wishlistItems.length}</p>
            <p className="text-xs text-muted-foreground">Saved Items</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <DollarSign className="w-5 h-5 text-secondary mb-2" />
            <p className="text-2xl font-bold text-foreground">
              AED {bookings.reduce((s, b) => s + Number(b.total_price), 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <Clock className="w-5 h-5 text-secondary mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="w-4 h-4" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="w-4 h-4" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {bookingsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">Start exploring Dubai experiences!</p>
                <Link to="/tours">
                  <Button>Browse Tours</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{b.tour_name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(b.booking_date).toLocaleDateString()}
                          </span>
                          <span>{b.adults} adults{b.children > 0 ? `, ${b.children} children` : ""}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-foreground">
                          AED {Number(b.total_price).toLocaleString()}
                        </span>
                        <Badge variant="outline" className={statusColor[b.status] || ""}>
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No saved items</h3>
                <p className="text-muted-foreground mb-4">Save tours you love to find them later!</p>
                <Link to="/tours">
                  <Button>Browse Tours</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-card rounded-xl p-4 border border-border">
                    <p className="font-medium text-foreground">{item.tour_id || item.service_id}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Saved {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                    {item.price_alert && (
                      <Badge variant="outline" className="mt-2 text-xs bg-secondary/10 text-secondary border-secondary/30">
                        Price Alert Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-card rounded-xl p-6 border border-border max-w-lg">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                  <p className="font-medium text-foreground">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                  <p className="font-medium text-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</label>
                  <p className="font-medium text-foreground">{profile?.phone || "Not set"}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Member Since</label>
                  <p className="font-medium text-foreground">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
