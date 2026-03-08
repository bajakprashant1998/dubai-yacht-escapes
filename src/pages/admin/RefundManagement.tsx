import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, Download } from "lucide-react";
import TablePagination from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { format } from "date-fns";

const AdminRefundManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: refunds = [], isLoading } = useQuery({
    queryKey: ["refund-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("refund_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const updates: any = { status, admin_notes };
      if (status === "approved") {
        updates.approved_at = new Date().toISOString();
      } else if (status === "processed") {
        updates.processed_at = new Date().toISOString();
      }
      const { error } = await supabase.from("refund_requests").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund-requests"] });
      toast.success("Refund request updated");
      setSelectedRefund(null);
      setAdminNotes("");
    },
    onError: () => toast.error("Failed to update refund"),
  });

  const filtered = refunds.filter((r: any) => {
    const matchesSearch = r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filtered, 10);

  const stats = {
    total: refunds.length,
    pending: refunds.filter((r: any) => r.status === "pending").length,
    approved: refunds.filter((r: any) => r.status === "approved").length,
    totalAmount: refunds.filter((r: any) => r.status !== "rejected").reduce((s: number, r: any) => s + Number(r.amount), 0),
  };

  const handleExport = () => {
    const csv = ["Customer,Email,Amount,Type,Status,Reason,Date"]
      .concat(filtered.map((r: any) =>
        `"${r.customer_name}","${r.customer_email}",${r.amount},"${r.refund_type}","${r.status}","${r.reason?.replace(/"/g, '""')}","${format(new Date(r.created_at), "yyyy-MM-dd")}"`
      )).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `refunds-${format(new Date(), "yyyy-MM-dd")}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported refunds");
  };

  const statusIcon = (status: string) => {
    if (status === "approved" || status === "processed") return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === "rejected") return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
    return <Clock className="w-3.5 h-3.5 text-amber-600" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Refund Management</h1>
            <p className="text-sm text-muted-foreground">Review and process refund requests</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-border"><CardContent className="p-4">
            <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /><p className="text-xs text-muted-foreground">Total Requests</p></div>
            <p className="text-xl font-bold text-foreground mt-1">{stats.total}</p>
          </CardContent></Card>
          <Card className="border-border"><CardContent className="p-4">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><p className="text-xs text-muted-foreground">Pending</p></div>
            <p className="text-xl font-bold text-foreground mt-1">{stats.pending}</p>
          </CardContent></Card>
          <Card className="border-border"><CardContent className="p-4">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /><p className="text-xs text-muted-foreground">Approved</p></div>
            <p className="text-xl font-bold text-foreground mt-1">{stats.approved}</p>
          </CardContent></Card>
          <Card className="border-border"><CardContent className="p-4">
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-secondary" /><p className="text-xs text-muted-foreground">Total Amount</p></div>
            <p className="text-xl font-bold text-foreground mt-1">AED {stats.totalAmount.toLocaleString()}</p>
          </CardContent></Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search refunds..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse w-20" /></TableCell>)}</TableRow>
                    ))
                  ) : pagination.paginatedItems.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No refund requests found</TableCell></TableRow>
                  ) : pagination.paginatedItems.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <p className="text-sm font-medium">{r.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{r.customer_email}</p>
                      </TableCell>
                      <TableCell className="font-semibold">AED {Number(r.amount).toLocaleString()}</TableCell>
                      <TableCell><span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{r.refund_type}</span></TableCell>
                      <TableCell><span className="text-xs truncate max-w-[150px] block">{r.reason}</span></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {statusIcon(r.status)}
                          <span className="text-xs capitalize">{r.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedRefund(r); setAdminNotes(r.admin_notes || ""); }}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <TablePagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={pagination.goToPage} totalItems={filtered.length} />

        {/* Review Dialog */}
        <Dialog open={!!selectedRefund} onOpenChange={() => setSelectedRefund(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Review Refund Request</DialogTitle></DialogHeader>
            {selectedRefund && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedRefund.customer_name}</p></div>
                  <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedRefund.customer_email}</p></div>
                  <div><p className="text-muted-foreground">Amount</p><p className="font-bold">AED {Number(selectedRefund.amount).toLocaleString()}</p></div>
                  <div><p className="text-muted-foreground">Type</p><p className="font-medium capitalize">{selectedRefund.refund_type}</p></div>
                </div>
                <div><p className="text-sm text-muted-foreground">Reason</p><p className="text-sm bg-muted/40 p-3 rounded-lg">{selectedRefund.reason}</p></div>
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add notes..." className="mt-1" />
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => updateMutation.mutate({ id: selectedRefund.id, status: "rejected", admin_notes: adminNotes })} disabled={updateMutation.isPending}>
                Reject
              </Button>
              {selectedRefund?.status === "pending" && (
                <Button variant="default" size="sm" onClick={() => updateMutation.mutate({ id: selectedRefund.id, status: "approved", admin_notes: adminNotes })} disabled={updateMutation.isPending}>
                  Approve
                </Button>
              )}
              {selectedRefund?.status === "approved" && (
                <Button variant="default" size="sm" onClick={() => updateMutation.mutate({ id: selectedRefund.id, status: "processed", admin_notes: adminNotes })} disabled={updateMutation.isPending}>
                  Mark Processed
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminRefundManagement;
