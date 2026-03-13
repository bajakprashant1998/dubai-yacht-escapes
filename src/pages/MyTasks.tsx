import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format, isPast, isToday } from "date-fns";
import { Clock, AlertTriangle, CheckCircle, XCircle, CalendarClock, ClipboardList, User } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-600",
  high: "bg-amber-500/10 text-amber-600",
  urgent: "bg-destructive/10 text-destructive",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  in_progress: AlertTriangle,
  completed: CheckCircle,
  cancelled: XCircle,
};

const MyTasks = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("active");

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

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["my-tasks", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_tasks")
        .select("*")
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: async (task: any) => {
      const updates: any = { status: task.status, notes: task.notes };
      if (task.status === "completed" && !task.completed_at) updates.completed_at = new Date().toISOString();
      const { error } = await supabase.from("staff_tasks").update(updates).eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
      setSelectedTask(null);
      toast.success("Task updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const activeTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
  const completedTasks = tasks.filter(t => t.status === "completed" || t.status === "cancelled");
  const overdueTasks = activeTasks.filter(t => t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)));

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
        </div>
      </Layout>
    );
  }

  const renderTask = (task: any) => {
    const StatusIcon = statusIcons[task.status] || Clock;
    const isOverdue = task.due_date && task.status !== "completed" && task.status !== "cancelled" && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
    const isDueToday = task.due_date && isToday(new Date(task.due_date));

    return (
      <Card
        key={task.id}
        className={`border-border hover:border-secondary/30 transition-all cursor-pointer hover:shadow-md ${isOverdue ? "border-destructive/40 bg-destructive/5" : ""}`}
        onClick={() => setSelectedTask({ ...task })}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${task.status === "completed" ? "text-green-500" : task.status === "cancelled" ? "text-muted-foreground" : isOverdue ? "text-destructive" : "text-muted-foreground"}`} />
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</h3>
              {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                {task.due_date && (
                  <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-destructive font-semibold" : isDueToday ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                    <CalendarClock className="w-3 h-3" />
                    {isOverdue ? "Overdue: " : isDueToday ? "Due Today" : "Due: "}
                    {format(new Date(task.due_date), "MMM d, yyyy")}
                  </span>
                )}
                {task.related_entity_type && (
                  <Badge variant="outline" className="text-[10px]">{task.related_entity_type}</Badge>
                )}
              </div>
            </div>
            <Badge variant={task.status === "completed" ? "default" : "outline"} className="flex-shrink-0 capitalize">
              {task.status.replace("_", " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <SEOHead title="My Tasks | BetterView Tourism" description="View and manage your assigned tasks" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Track and update your assigned tasks</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className={`border-border ${overdueTasks.length > 0 ? "border-destructive/40" : ""}`}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${overdueTasks.length > 0 ? "text-destructive" : "text-foreground"}`}>{overdueTasks.length}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-3">
              {activeTasks.length > 0 ? activeTasks.map(renderTask) : (
                <div className="text-center py-16 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm">No active tasks assigned to you.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-3">
              {completedTasks.length > 0 ? completedTasks.map(renderTask) : (
                <div className="text-center py-16 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No completed tasks yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Task Detail / Update Dialog */}
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Task Details</DialogTitle></DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Title</Label>
                  <p className="font-medium text-foreground">{selectedTask.title}</p>
                </div>
                {selectedTask.description && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Description</Label>
                    <p className="text-sm text-foreground">{selectedTask.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Priority</Label>
                    <Badge className={`mt-1 ${priorityColors[selectedTask.priority]}`}>{selectedTask.priority}</Badge>
                  </div>
                  {selectedTask.due_date && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Due Date</Label>
                      <p className="text-sm font-medium">{format(new Date(selectedTask.due_date), "MMM d, yyyy")}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Update Status</Label>
                  <Select value={selectedTask.status} onValueChange={v => setSelectedTask((t: any) => ({ ...t, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={selectedTask.notes || ""}
                    onChange={e => setSelectedTask((t: any) => ({ ...t, notes: e.target.value }))}
                    rows={3}
                    placeholder="Add progress notes..."
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate(selectedTask)} disabled={updateMutation.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MyTasks;
