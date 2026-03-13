import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const columns = [
  { id: "pending", title: "Pending", icon: Clock, color: "border-t-amber-500" },
  { id: "in_progress", title: "In Progress", icon: AlertTriangle, color: "border-t-blue-500" },
  { id: "completed", title: "Completed", icon: CheckCircle, color: "border-t-green-500" },
  { id: "cancelled", title: "Cancelled", icon: XCircle, color: "border-t-muted-foreground" },
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
                  className={`rounded-xl border-t-4 ${col.color} bg-muted/30 border border-border p-3 min-h-[300px] transition-colors ${snapshot.isDraggingOver ? "bg-secondary/10" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <col.icon className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={dragSnapshot.isDragging ? "opacity-80 rotate-2" : ""}
                          >
                            <TaskCard
                              task={task}
                              getAssigneeName={getAssigneeName}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              compact
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
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
