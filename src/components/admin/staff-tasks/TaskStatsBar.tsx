import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const TaskStatsBar = ({ stats }: { stats: TaskStats }) => {
  const items = [
    { label: "Total Tasks", value: stats.total, icon: ClipboardList },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "In Progress", value: stats.inProgress, icon: AlertTriangle },
    { label: "Completed", value: stats.completed, icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((s) => (
        <Card key={s.label} className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <s.icon className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskStatsBar;
