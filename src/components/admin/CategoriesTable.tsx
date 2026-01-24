import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical,
  Ship,
  Anchor,
  Crown,
  Users,
  Waves,
  Sailboat,
  Compass,
  MapPin,
  FolderOpen,
  Star,
  Sunset,
  PartyPopper,
  Camera,
  UtensilsCrossed,
  Music,
  Sun,
  Moon,
} from "lucide-react";
import type { CategoryWithCount } from "@/hooks/useCategories";

// Icon mapping for category icons
const ICON_MAP: Record<string, React.ElementType> = {
  ship: Ship,
  anchor: Anchor,
  crown: Crown,
  users: Users,
  waves: Waves,
  sailboat: Sailboat,
  compass: Compass,
  "map-pin": MapPin,
  folder: FolderOpen,
  star: Star,
  sunset: Sunset,
  "party-popper": PartyPopper,
  camera: Camera,
  utensils: UtensilsCrossed,
  music: Music,
  sun: Sun,
  moon: Moon,
};

interface CategoriesTableProps {
  categories: CategoryWithCount[];
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (id: string) => void;
  onReorder: (reorderedCategories: CategoryWithCount[]) => void;
  isDeleting?: boolean;
  isReordering?: boolean;
}

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  onReorder,
  isDeleting,
  isReordering,
}: CategoriesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const reordered = Array.from(categories);
    const [removed] = reordered.splice(sourceIndex, 1);
    reordered.splice(destIndex, 0, removed);

    // Update sort_order for all items
    const withUpdatedOrder = reordered.map((cat, index) => ({
      ...cat,
      sort_order: index,
    }));

    onReorder(withUpdatedOrder);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-12">Icon</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="text-center w-20">Order</TableHead>
                <TableHead className="text-center w-20">Tours</TableHead>
                <TableHead className="text-center w-24">Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <Droppable droppableId="categories">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {categories.map((category, index) => {
                    const IconComponent = ICON_MAP[category.icon || "folder"] || FolderOpen;
                    return (
                      <Draggable
                        key={category.id}
                        draggableId={category.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={snapshot.isDragging ? "bg-muted" : ""}
                          >
                            <TableCell>
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                              >
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-primary" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {category.name}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {category.slug}
                              </code>
                            </TableCell>
                            <TableCell className="hidden md:table-cell max-w-[200px]">
                              <span className="text-muted-foreground text-sm truncate block">
                                {category.description || "—"}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">{category.sort_order}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={category.tour_count > 0 ? "default" : "secondary"}
                                className="min-w-[40px]"
                              >
                                {category.tour_count}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={category.is_active ? "default" : "secondary"}
                                className={
                                  category.is_active
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                                    : ""
                                }
                              >
                                {category.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEdit(category)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(category.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>

      {/* Reordering indicator */}
      {isReordering && (
        <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
          Saving order...
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Tours using this
              category will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
