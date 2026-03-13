import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle, XCircle, User, Trash2, CalendarClock, GripVertical } from "lucide-react";
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
  isDragging?: boolean;
}

const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ task, getAssigneeName, onEdit, onDelete, compact, isDragging, className, ...props }, ref) => {
    const StatusIcon = statusIcons[task.status] || Clock;
    const isOverdue = task.due_date && task.status !== "completed" && task.status !== "cancelled" && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
    const isDueToday = task.due_date && isToday(new Date(task.due_date));

    return (
      <div ref={ref} className={className} {...props}>
        <Card
          className={`border-border hover:border-secondary/30 transition-all cursor-pointer group ${isOverdue ? "border-destructive/40 bg-destructive/5" : ""} ${isDragging ? "shadow-lg ring-2 ring-secondary/30 rotate-1" : ""}`}
          onClick={() => onEdit({ ...task })}
        >
          <CardContent className={compact ? "p-3" : "p-4"}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {compact && <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${task.status === "completed" ? "text-green-500" : task.status === "cancelled" ? "text-muted-foreground" : isOverdue ? "text-destructive" : "text-muted-foreground"}`} />
                  <h3 className={`font-medium text-sm truncate ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</h3>
                </div>
                {task.description && !compact && (
                  <p className="text-sm text-muted-foreground line-clamp-1 ml-6">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 ml-6 flex-wrap">
                  <Badge className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" /> {getAssigneeName(task.assigned_to)}
                  </span>
                  {task.due_date && (
                    <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-destructive font-semibold" : isDueToday ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                      <CalendarClock className="w-3 h-3" />
                      {isOverdue ? "Overdue: " : isDueToday ? "Today" : ""}
                      {!isDueToday && format(new Date(task.due_date), "MMM d")}
                    </span>
                  )}
                  {task.related_entity_type && !compact && (
                    <Badge variant="outline" className="text-[10px]">{task.related_entity_type}</Badge>
                  )}
                </div>
              </div>
              {!compact && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
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
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
export { priorityColors, statusIcons };
