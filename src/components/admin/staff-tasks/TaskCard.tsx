import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle, XCircle, User, Trash2, CalendarClock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format, isPast, isToday } from "date-fns";

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

interface TaskCardProps {
  task: any;
  getAssigneeName: (userId: string | null) => string;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const TaskCard = ({ task, getAssigneeName, onEdit, onDelete, compact }: TaskCardProps) => {
  const StatusIcon = statusIcons[task.status] || Clock;
  const isOverdue = task.due_date && task.status !== "completed" && task.status !== "cancelled" && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  return (
    <Card
      className={`border-border hover:border-secondary/30 transition-colors cursor-pointer ${isOverdue ? "border-destructive/40 bg-destructive/5" : ""}`}
      onClick={() => onEdit({ ...task })}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusIcon className={`w-4 h-4 flex-shrink-0 ${task.status === "completed" ? "text-green-500" : task.status === "cancelled" ? "text-muted-foreground" : "text-muted-foreground"}`} />
              <h3 className={`font-medium truncate ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</h3>
            </div>
            {task.description && !compact && (
              <p className="text-sm text-muted-foreground line-clamp-1 ml-6">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2 ml-6 flex-wrap">
              <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" /> {getAssigneeName(task.assigned_to)}
              </span>
              {task.due_date && (
                <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-destructive font-medium" : isDueToday ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                  <CalendarClock className="w-3 h-3" />
                  {isOverdue ? "Overdue: " : isDueToday ? "Today" : ""}
                  {!isDueToday && format(new Date(task.due_date), "MMM d")}
                </span>
              )}
              {task.related_entity_type && (
                <Badge variant="outline" className="text-[10px]">{task.related_entity_type}</Badge>
              )}
            </div>
          </div>
          {!compact && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete task?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(task.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
