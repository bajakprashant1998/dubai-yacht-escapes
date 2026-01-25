import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, History, Trash2, Eye, RefreshCw, Filter } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useActivityLogs,
  useDeleteOldLogs,
  ActivityLog,
  EntityType,
  ActivityAction,
  getActionColor,
  getEntityIcon,
  formatAction,
  formatEntityType,
} from "@/hooks/useActivityLog";

const ENTITY_TYPES: EntityType[] = [
  "booking",
  "tour",
  "category",
  "inquiry",
  "review",
  "customer",
  "discount",
  "gallery",
  "location",
  "site_settings",
  "email_template",
];

const ACTION_TYPES: ActivityAction[] = [
  "create",
  "update",
  "delete",
  "status_change",
  "bulk_delete",
  "bulk_update",
  "settings_update",
];

const AdminActivityLog = () => {
  const [entityFilter, setEntityFilter] = useState<EntityType | "all">("all");
  const [actionFilter, setActionFilter] = useState<ActivityAction | "all">("all");
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    data: logs = [],
    isLoading,
    refetch,
    isRefetching,
  } = useActivityLogs({
    limit: 100,
    entityType: entityFilter === "all" ? undefined : entityFilter,
    action: actionFilter === "all" ? undefined : actionFilter,
  });

  const deleteOldLogs = useDeleteOldLogs();

  const handleDeleteOldLogs = () => {
    deleteOldLogs.mutate(90, {
      onSuccess: () => {
        toast.success("Old logs deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete old logs");
      },
    });
  };

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const clearFilters = () => {
    setEntityFilter("all");
    setActionFilter("all");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <History className="w-7 h-7 text-primary" />
              Activity Log
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all admin actions and changes for audit purposes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clean Up
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Old Logs?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all activity logs older than 90 days.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteOldLogs}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Old Logs
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              Filters:
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={entityFilter}
                onValueChange={(value) => setEntityFilter(value as EntityType | "all")}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {ENTITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getEntityIcon(type)} {formatEntityType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={actionFilter}
                onValueChange={(value) => setActionFilter(value as ActivityAction | "all")}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {ACTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatAction(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(entityFilter !== "all" || actionFilter !== "all") && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Logs</p>
            <p className="text-2xl font-bold text-foreground">{logs.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Creates</p>
            <p className="text-2xl font-bold text-primary">
              {logs.filter((l) => l.action === "create").length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Updates</p>
            <p className="text-2xl font-bold text-secondary">
              {logs.filter((l) => l.action === "update" || l.action === "settings_update").length}
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Deletes</p>
            <p className="text-2xl font-bold text-destructive">
              {logs.filter((l) => l.action === "delete" || l.action === "bulk_delete").length}
            </p>
          </div>
        </div>

        {/* Activity Log Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p>No activity logs found</p>
              {(entityFilter !== "all" || actionFilter !== "all") && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters to see all logs
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead className="text-right w-[80px]">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-[150px]">
                            {log.user_email || "System"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)} variant="secondary">
                          {formatAction(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getEntityIcon(log.entity_type)}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {formatEntityType(log.entity_type)}
                            </span>
                            {log.entity_name && (
                              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {log.entity_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                          {log.entity_id ? `ID: ${log.entity_id.slice(0, 8)}...` : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-xl">{selectedLog && getEntityIcon(selectedLog.entity_type)}</span>
                Activity Details
              </DialogTitle>
              <DialogDescription>
                {selectedLog && format(new Date(selectedLog.created_at), "MMMM d, yyyy 'at' HH:mm:ss")}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Action</p>
                      <Badge className={getActionColor(selectedLog.action)}>
                        {formatAction(selectedLog.action)}
                      </Badge>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Entity Type</p>
                      <p className="font-medium">{formatEntityType(selectedLog.entity_type)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">User</p>
                      <p className="font-medium text-sm truncate">
                        {selectedLog.user_email || "System"}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Entity ID</p>
                      <p className="font-mono text-xs truncate">
                        {selectedLog.entity_id || "-"}
                      </p>
                    </div>
                  </div>

                  {selectedLog.entity_name && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Entity Name</p>
                      <p className="font-medium">{selectedLog.entity_name}</p>
                    </div>
                  )}

                  {/* Old Data */}
                  {selectedLog.old_data && typeof selectedLog.old_data === 'object' && Object.keys(selectedLog.old_data).length > 0 && (
                    <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/30">
                      <p className="text-xs text-destructive mb-2 font-medium">
                        Previous Values
                      </p>
                      <pre className="text-xs overflow-x-auto text-destructive/80 whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.old_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* New Data */}
                  {selectedLog.new_data && typeof selectedLog.new_data === 'object' && Object.keys(selectedLog.new_data).length > 0 && (
                    <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
                      <p className="text-xs text-primary mb-2 font-medium">
                        New Values
                      </p>
                      <pre className="text-xs overflow-x-auto text-primary/80 whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.new_data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Metadata */}
                  {selectedLog.metadata && typeof selectedLog.metadata === 'object' && Object.keys(selectedLog.metadata).length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-2">Additional Info</p>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* User Agent */}
                  {selectedLog.user_agent && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                      <p className="text-xs text-muted-foreground break-all">
                        {selectedLog.user_agent}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
