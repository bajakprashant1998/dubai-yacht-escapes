import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Plane,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const AITripDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['admin-trip-plans', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('trip_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-trip-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trip_plans')
        .select('status, total_price_aed');

      if (error) throw error;

      const total = data.length;
      const booked = data.filter(t => t.status === 'booked').length;
      const confirmed = data.filter(t => t.status === 'confirmed').length;
      const totalRevenue = data
        .filter(t => t.status === 'booked')
        .reduce((sum, t) => sum + (t.total_price_aed || 0), 0);
      const avgValue = total > 0 
        ? data.reduce((sum, t) => sum + (t.total_price_aed || 0), 0) / total 
        : 0;

      return {
        total,
        booked,
        confirmed,
        conversionRate: total > 0 ? ((booked / total) * 100).toFixed(1) : 0,
        totalRevenue,
        avgValue,
      };
    },
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Trip Planner</h1>
          <p className="text-muted-foreground">
            Monitor AI-generated trip plans and conversion rates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats?.booked || 0} booked trips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">From AI trips</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Trip Value</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.avgValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Per generated trip</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
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
        </div>

        {/* Trips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent AI-Generated Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
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
                    <TableRow key={trip.id}>
                      <TableCell className="text-sm">
                        {format(new Date(trip.created_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(trip.arrival_date), 'MMM d')} - {format(new Date(trip.departure_date), 'MMM d')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {trip.travelers_adults + trip.travelers_children}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {trip.budget_tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{trip.travel_style}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(trip.total_price_aed || 0)}
                      </TableCell>
                      <TableCell>{getStatusBadge(trip.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AITripDashboard;
