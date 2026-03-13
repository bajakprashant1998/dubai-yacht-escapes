import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TaskEditDialogProps {
  task: any;
  onClose: () => void;
  setTask: (fn: (t: any) => any) => void;
  profiles: any[];
  onSave: () => void;
  isPending: boolean;
}

const TaskEditDialog = ({ task, onClose, setTask, profiles, onSave, isPending }: TaskEditDialogProps) => {
  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <p className="text-sm font-medium text-foreground">{task.title}</p>
          </div>
          {task.description && (
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Label>Due Date:</Label>
              <Badge variant="outline">{format(new Date(task.due_date), "MMM d, yyyy")}</Badge>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={task.status} onValueChange={v => setTask(t => ({ ...t, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={task.priority} onValueChange={v => setTask(t => ({ ...t, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Assign To</Label>
            <Select value={task.assigned_to || ""} onValueChange={v => setTask(t => ({ ...t, assigned_to: v }))}>
              <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                {profiles.map(p => <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || "Unnamed"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={task.notes || ""} onChange={e => setTask(t => ({ ...t, notes: e.target.value }))} rows={3} placeholder="Add notes about this task..." />
          </div>
          {task.completed_at && (
            <p className="text-xs text-muted-foreground">Completed: {format(new Date(task.completed_at), "MMM d, yyyy 'at' h:mm a")}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave} disabled={isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
