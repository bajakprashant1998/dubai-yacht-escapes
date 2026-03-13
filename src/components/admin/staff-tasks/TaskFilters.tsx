import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, LayoutList, Columns3 } from "lucide-react";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  priorityFilter: string;
  onPriorityChange: (v: string) => void;
  viewMode: "list" | "kanban";
  onViewModeChange: (v: "list" | "kanban") => void;
}

const TaskFilters = ({
  search, onSearchChange,
  statusFilter, onStatusChange,
  priorityFilter, onPriorityChange,
  viewMode, onViewModeChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search tasks..." value={search} onChange={e => onSearchChange(e.target.value)} className="pl-9" />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex border border-border rounded-lg overflow-hidden">
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className="rounded-none h-10"
          onClick={() => onViewModeChange("list")}
        >
          <LayoutList className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "kanban" ? "secondary" : "ghost"}
          size="icon"
          className="rounded-none h-10"
          onClick={() => onViewModeChange("kanban")}
        >
          <Columns3 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters;
