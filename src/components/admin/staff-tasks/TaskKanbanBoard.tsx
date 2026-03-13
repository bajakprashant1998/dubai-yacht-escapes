import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const columns = [
  { id: "pending", title: "Pending", icon: Clock, colorClass: "border-t-amber-500 dark:border-t-amber-400" },
  { id: "in_progress", title: "In Progress", icon: AlertTriangle, colorClass: "border-t-blue-500 dark:border-t-blue-400" },
  { id: "completed", title: "Completed", icon: CheckCircle, colorClass: "border-t-green-500 dark:border-t-green-400" },
  { id: "cancelled", title: "Cancelled", icon: XCircle, colorClass: "border-t-muted-foreground" },
];

interface TaskKanbanBoardProps {
  tasks: any[];
  getAssigneeName: (userId: string | null) => string;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskKanbanBoard = ({ tasks, getAssigneeName, onEdit, onDelete, onStatusChange }: TaskKanbanBoardProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl border-t-4 ${col.colorClass} bg-muted/30 border border-border p-3 min-h-[300px] transition-colors ${snapshot.isDraggingOver ? "bg-secondary/10 border-secondary/30" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <col.icon className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">{colTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <TaskCard
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            task={task}
                            getAssigneeName={getAssigneeName}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            compact
                            isDragging={dragSnapshot.isDragging}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {colTasks.length === 0 && (
                      <p className="text-xs text-muted-foreground/50 text-center py-8">
                        Drop tasks here
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskKanbanBoard;
