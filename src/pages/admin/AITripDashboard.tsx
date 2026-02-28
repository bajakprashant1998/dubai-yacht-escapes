import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Plane,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  Trash2,
  Download,
  UserPlus,
  Search,
  Mail,
  Phone,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { exportToCsv } from '@/lib/exportCsv';
import { toast } from 'sonner';

// ─── Trip Plans Tab ───
const TripPlansTab = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['admin-trip-plans', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('trip_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete trip items first, then trip plans
      const { error: itemsError } = await supabase.from('trip_items').delete().in('trip_id', ids);
      if (itemsError) throw itemsError;
      const { error } = await supabase.from('trip_plans').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trip-plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-trip-stats'] });
      setSelectedIds(new Set());
      toast.success('Trip plan(s) deleted successfully');
    },
    onError: () => toast.error('Failed to delete trip plan(s)'),
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === trips.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(trips.map(t => t.id)));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Booked</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(amount);

  const handleExportCsv = () => {
    if (trips.length === 0) return;
    exportToCsv(
      trips.map(t => ({
        created_at: t.created_at,
        arrival_date: t.arrival_date,
        departure_date: t.departure_date,
        travelers: t.travelers_adults + t.travelers_children,
        budget_tier: t.budget_tier,
        travel_style: t.travel_style,
        total_price_aed: t.total_price_aed || 0,
        status: t.status,
      })),
      `trip-plans-${new Date().toISOString().split('T')[0]}`,
      [
        { key: 'created_at', label: 'Created' },
        { key: 'arrival_date', label: 'Arrival' },
        { key: 'departure_date', label: 'Departure' },
        { key: 'travelers', label: 'Travelers' },
        { key: 'budget_tier', label: 'Budget' },
        { key: 'travel_style', label: 'Style' },
        { key: 'total_price_aed', label: 'Value (AED)' },
        { key: 'status', label: 'Status' },
      ]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap items-center">
          {['all', 'draft', 'confirmed', 'booked', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
          {selectedIds.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete {selectedIds.size}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedIds.size} trip plan(s)?</AlertDialogTitle>
                  <AlertDialogDescription>This will permanently remove the selected trip plans and their itinerary items. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMutation.mutate([...selectedIds])}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={trips.length === 0}>
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No trips generated yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.size === trips.length && trips.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Style</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} data-state={selectedIds.has(trip.id) ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(trip.id)}
                        onCheckedChange={() => toggleSelect(trip.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm">{format(new Date(trip.created_at), 'MMM d, HH:mm')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(trip.arrival_date), 'MMM d')} – {format(new Date(trip.departure_date), 'MMM d')}
                      </div>
                    </TableCell>
                    <TableCell>{trip.travelers_adults + trip.travelers_children}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{trip.budget_tier}</Badge></TableCell>
                    <TableCell className="capitalize">{trip.travel_style}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(trip.total_price_aed || 0)}</TableCell>
                    <TableCell>{getStatusBadge(trip.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this trip plan?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove the trip and its itinerary items.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate([trip.id])}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Leads Tab ───
const LeadsTab = () => {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-trip-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trip_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.phone && lead.phone.toLowerCase().includes(q))
    );
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('trip_leads').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trip-leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin-trip-stats'] });
      setSelectedIds(new Set());
      toast.success('Lead(s) deleted successfully');
    },
    onError: () => toast.error('Failed to delete lead(s)'),
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    exportToCsv(
      leads.map(l => ({
        name: l.name,
        email: l.email,
        phone: l.phone || '',
        travel_date: l.travel_date || '',
        notes: l.notes || '',
        status: l.status,
        created_at: l.created_at,
      })),
      `trip-leads-${new Date().toISOString().split('T')[0]}`,
      [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'travel_date', label: 'Travel Date' },
        { key: 'notes', label: 'Notes' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Submitted At' },
      ]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          {selectedIds.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete {selectedIds.size}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {selectedIds.size} lead(s)?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteMutation.mutate([...selectedIds])}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={leads.length === 0}>
          <Download className="w-4 h-4 mr-1" /> Download CSV
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'No leads match your search' : 'No leads captured yet'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} data-state={selectedIds.has(lead.id) ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(lead.id)}
                        onCheckedChange={() => toggleSelect(lead.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <a href={`mailto:${lead.email}`} className="hover:underline text-primary">{lead.email}</a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lead.travel_date ? format(new Date(lead.travel_date), 'MMM d, yyyy') : '—'}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{lead.notes || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={lead.status === 'new' ? 'default' : lead.status === 'generated' ? 'secondary' : 'outline'}
                        className="capitalize"
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{format(new Date(lead.created_at), 'MMM d, HH:mm')}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently remove {lead.name}'s lead data.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate([lead.id])}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Main Dashboard ───
const AITripDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-trip-stats'],
    queryFn: async () => {
      const [tripsRes, leadsRes] = await Promise.all([
        supabase.from('trip_plans').select('status, total_price_aed'),
        supabase.from('trip_leads').select('id', { count: 'exact', head: true }),
      ]);
      if (tripsRes.error) throw tripsRes.error;
      const data = tripsRes.data;
      const total = data.length;
      const booked = data.filter(t => t.status === 'booked').length;
      const totalRevenue = data.filter(t => t.status === 'booked').reduce((sum, t) => sum + (t.total_price_aed || 0), 0);
      const avgValue = total > 0 ? data.reduce((sum, t) => sum + (t.total_price_aed || 0), 0) / total : 0;

      return {
        total,
        booked,
        conversionRate: total > 0 ? ((booked / total) * 100).toFixed(1) : '0',
        totalRevenue,
        avgValue,
        leadCount: leadsRes.count || 0,
      };
    },
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0 }).format(amount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Trip Planner</h1>
          <p className="text-muted-foreground">Monitor AI-generated trip plans, leads, and conversion rates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">AI-generated plans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.leadCount || 0}</div>
              <p className="text-xs text-muted-foreground">Trip planning leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">{stats?.booked || 0} booked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              <p className="text-xs text-muted-foreground">From AI trips</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Value</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.avgValue || 0)}</div>
              <p className="text-xs text-muted-foreground">Per trip</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="trips">Trip Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="leads">
            <LeadsTab />
          </TabsContent>
          <TabsContent value="trips">
            <TripPlansTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AITripDashboard;
