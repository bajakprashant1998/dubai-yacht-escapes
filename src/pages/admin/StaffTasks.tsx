import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, ClipboardList, TrendingUp, AlertTriangle as AlertIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { isPast, isToday } from "date-fns";
import TaskStatsBar from "@/components/admin/staff-tasks/TaskStatsBar";
import TaskFilters from "@/components/admin/staff-tasks/TaskFilters";
import TaskCard from "@/components/admin/staff-tasks/TaskCard";
import TaskCreateDialog from "@/components/admin/staff-tasks/TaskCreateDialog";
import TaskEditDialog from "@/components/admin/staff-tasks/TaskEditDialog";
import TaskKanbanBoard from "@/components/admin/staff-tasks/TaskKanbanBoard";

const AdminStaffTasks = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [createDialog, setCreateDialog] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", assigned_to: "", priority: "medium", due_date: "", related_entity_type: "" });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["staff-tasks", statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase.from("staff_tasks").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      if (priorityFilter !== "all") query = query.eq("priority", priorityFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["staff-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, full_name");
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (task: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("staff_tasks").insert({
        title: task.title,
        description: task.description || null,
        assigned_to: task.assigned_to || null,
        priority: task.priority,
        due_date: task.due_date || null,
        related_entity_type: task.related_entity_type || null,
        created_by: user?.id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-tasks"] });
      setCreateDialog(false);
      setForm({ title: "", description: "", assigned_to: "", priority: "medium", due_date: "", related_entity_type: "" });
      toast.success("Task created successfully");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (task: any) => {
      const updates: any = { status: task.status, priority: task.priority, notes: task.notes, assigned_to: task.assigned_to || null };
      if (task.status === "completed" && !task.completed_at) updates.completed_at = new Date().toISOString();
      const { error } = await supabase.from("staff_tasks").update(updates).eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-tasks"] });
      setEditTask(null);
      toast.success("Task updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-tasks"] });
      toast.success("Task deleted");
    },
  });

  const handleKanbanStatusChange = (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateMutation.mutate({ ...task, status: newStatus });
  };

  const filtered = tasks.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  const overdueTasks = tasks.filter(t =>
    t.due_date && t.status !== "completed" && t.status !== "cancelled" &&
    isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date))
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  const getAssigneeName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    return profiles.find(p => p.user_id === userId)?.full_name || "Unknown";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Staff Tasks</h1>
            <p className="text-sm text-muted-foreground">Assign, track, and manage tasks for your team</p>
          </div>
          <Button onClick={() => setCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>

        {/* Overdue Alert Banner */}
        {overdueTasks.length > 0 && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-3 flex items-center gap-3">
              <AlertIcon className="w-5 h-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""} need attention
                </p>
                <p className="text-xs text-muted-foreground">
                  {overdueTasks.map(t => t.title).slice(0, 3).join(", ")}
                  {overdueTasks.length > 3 ? ` +${overdueTasks.length - 3} more` : ""}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        )}

        <TaskStatsBar stats={stats} />

        <TaskFilters
          search={search} onSearchChange={setSearch}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter}
          viewMode={viewMode} onViewModeChange={setViewMode}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          </div>
        ) : viewMode === "kanban" ? (
          <TaskKanbanBoard
            tasks={filtered}
            getAssigneeName={getAssigneeName}
            onEdit={(task) => setEditTask({ ...task })}
            onDelete={(id) => deleteMutation.mutate(id)}
            onStatusChange={handleKanbanStatusChange}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                getAssigneeName={getAssigneeName}
                onEdit={(task) => setEditTask({ ...task })}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No tasks found</p>
                <p className="text-sm">Create a new task or adjust your filters.</p>
              </div>
            )}
          </div>
        )}

        <TaskCreateDialog
          open={createDialog}
          onOpenChange={setCreateDialog}
          form={form}
          setForm={setForm}
          profiles={profiles}
          onSubmit={() => createMutation.mutate(form)}
          isPending={createMutation.isPending}
        />

        <TaskEditDialog
          task={editTask}
          onClose={() => setEditTask(null)}
          setTask={setEditTask}
          profiles={profiles}
          onSave={() => updateMutation.mutate(editTask)}
          isPending={updateMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminStaffTasks;
