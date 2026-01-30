import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, Trash2, Clock, GripVertical, Package, Hotel, Car, Utensils, Ticket, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComboPackageItem, ComboPackageItemInput } from "@/hooks/useComboPackages";

interface ItineraryItem extends Omit<ComboPackageItemInput, 'combo_id'> {
  id?: string;
  tempId?: string;
}

interface ComboItineraryBuilderProps {
  comboId?: string;
  totalDays: number;
  initialItems?: ComboPackageItem[];
  onChange: (items: ItineraryItem[]) => void;
}

const itemTypeIcons: Record<string, React.ElementType> = {
  activity: Ticket,
  hotel: Hotel,
  transport: Car,
  meal: Utensils,
  sightseeing: MapPin,
};

const itemTypeOptions = [
  { value: "activity", label: "Activity/Tour" },
  { value: "hotel", label: "Hotel Check-in/out" },
  { value: "transport", label: "Transport/Transfer" },
  { value: "meal", label: "Meal/Dining" },
  { value: "sightseeing", label: "Sightseeing" },
];

const ComboItineraryBuilder = ({
  comboId,
  totalDays,
  initialItems = [],
  onChange,
}: ComboItineraryBuilderProps) => {
  const [activeDay, setActiveDay] = useState(1);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    day_number: 1,
    item_type: "activity",
    title: "",
    description: "",
    start_time: "09:00",
    end_time: "12:00",
    price_aed: 0,
    is_mandatory: true,
    is_flexible: false,
  });

  // Initialize items from props
  useEffect(() => {
    if (initialItems.length > 0) {
      const mappedItems: ItineraryItem[] = initialItems.map(item => ({
        id: item.id,
        day_number: item.day_number,
        item_type: item.item_type,
        item_id: item.item_id,
        title: item.title,
        description: item.description,
        start_time: item.start_time,
        end_time: item.end_time,
        price_aed: item.price_aed,
        is_mandatory: item.is_mandatory,
        is_flexible: item.is_flexible,
        sort_order: item.sort_order,
      }));
      setItems(mappedItems);
    }
  }, [initialItems]);

  // Notify parent of changes
  useEffect(() => {
    onChange(items);
  }, [items, onChange]);

  const getItemsForDay = (day: number) => {
    return items
      .filter((item) => item.day_number === day)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceDay = parseInt(result.source.droppableId.replace("day-", ""));
    const destDay = parseInt(result.destination.droppableId.replace("day-", ""));
    
    const dayItems = getItemsForDay(sourceDay);
    const [movedItem] = dayItems.splice(result.source.index, 1);
    
    if (!movedItem) return;

    // Update the moved item's day and sort order
    const updatedItem = {
      ...movedItem,
      day_number: destDay,
      sort_order: result.destination.index,
    };

    // Rebuild items array with updated positions
    const otherItems = items.filter(
      (item) => (item.id || item.tempId) !== (movedItem.id || movedItem.tempId)
    );
    
    const newItems = [...otherItems, updatedItem].map((item, idx) => ({
      ...item,
      sort_order: item.day_number === destDay 
        ? items.filter(i => i.day_number === destDay).indexOf(item)
        : item.sort_order,
    }));

    setItems(newItems);
  };

  const handleAddItem = () => {
    const itemToAdd: ItineraryItem = {
      ...newItem,
      tempId: `temp-${Date.now()}`,
      day_number: activeDay,
      sort_order: getItemsForDay(activeDay).length,
    } as ItineraryItem;

    setItems([...items, itemToAdd]);
    setIsAddDialogOpen(false);
    resetNewItem();
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const updatedItems = items.map((item) => 
      (item.id || item.tempId) === (editingItem.id || editingItem.tempId)
        ? { ...editingItem }
        : item
    );
    
    setItems(updatedItems);
    setEditingItem(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteItem = (itemToDelete: ItineraryItem) => {
    const filteredItems = items.filter(
      (item) => (item.id || item.tempId) !== (itemToDelete.id || itemToDelete.tempId)
    );
    setItems(filteredItems);
  };

  const resetNewItem = () => {
    setNewItem({
      day_number: activeDay,
      item_type: "activity",
      title: "",
      description: "",
      start_time: "09:00",
      end_time: "12:00",
      price_aed: 0,
      is_mandatory: true,
      is_flexible: false,
    });
  };

  const openEditDialog = (item: ItineraryItem) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    resetNewItem();
    setIsAddDialogOpen(true);
  };

  const currentItem = editingItem || newItem;
  const setCurrentItem = editingItem ? setEditingItem : setNewItem;

  const ItemIcon = itemTypeIcons[currentItem.item_type || "activity"] || Ticket;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Day-by-Day Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Day Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
            const dayItemCount = getItemsForDay(day).length;
            return (
              <Button
                key={day}
                type="button"
                variant={activeDay === day ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDay(day)}
                className="relative min-w-[80px]"
              >
                Day {day}
                {dayItemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs",
                      activeDay === day && "bg-primary-foreground text-primary"
                    )}
                  >
                    {dayItemCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Items List with Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`day-${activeDay}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-colors",
                  snapshot.isDraggingOver
                    ? "border-secondary bg-secondary/5"
                    : "border-border"
                )}
              >
                {getItemsForDay(activeDay).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <Package className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No activities for Day {activeDay}</p>
                    <p className="text-xs">Add activities using the button below</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getItemsForDay(activeDay).map((item, index) => {
                      const Icon = itemTypeIcons[item.item_type] || Ticket;
                      return (
                        <Draggable
                          key={item.id || item.tempId}
                          draggableId={item.id || item.tempId || `item-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center gap-3 p-4 bg-card rounded-lg border transition-all",
                                snapshot.isDragging && "shadow-lg ring-2 ring-secondary"
                              )}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                                <Icon className="h-5 w-5 text-secondary" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {item.start_time && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {item.start_time}
                                      {item.end_time && ` - ${item.end_time}`}
                                    </span>
                                  )}
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {item.item_type}
                                  </Badge>
                                </div>
                                <p className="font-medium truncate">{item.title}</p>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {item.price_aed > 0 && (
                                  <span className="text-sm font-medium text-secondary">
                                    AED {item.price_aed}
                                  </span>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(item)}
                                >
                                  <span className="sr-only">Edit</span>
                                  ✏️
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add Activity Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity to Day {activeDay}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Activity" : `Add Activity - Day ${activeDay}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Activity Type</Label>
                  <Select
                    value={currentItem.item_type || "activity"}
                    onValueChange={(v) => setCurrentItem((prev: any) => ({ ...prev, item_type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select
                    value={String(currentItem.day_number || activeDay)}
                    onValueChange={(v) => setCurrentItem((prev: any) => ({ ...prev, day_number: parseInt(v) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          Day {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={currentItem.title || ""}
                  onChange={(e) => setCurrentItem((prev: any) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Burj Khalifa Visit"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={currentItem.description || ""}
                  onChange={(e) => setCurrentItem((prev: any) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the activity..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={currentItem.start_time || ""}
                    onChange={(e) => setCurrentItem((prev: any) => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={currentItem.end_time || ""}
                    onChange={(e) => setCurrentItem((prev: any) => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (AED)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={currentItem.price_aed || 0}
                    onChange={(e) => setCurrentItem((prev: any) => ({ ...prev, price_aed: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentItem.is_mandatory ?? true}
                    onCheckedChange={(v) => setCurrentItem((prev: any) => ({ ...prev, is_mandatory: v }))}
                  />
                  <Label className="text-sm">Included in package</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={currentItem.is_flexible ?? false}
                    onCheckedChange={(v) => setCurrentItem((prev: any) => ({ ...prev, is_flexible: v }))}
                  />
                  <Label className="text-sm">Flexible timing</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  disabled={!currentItem.title}
                >
                  {editingItem ? "Update" : "Add Activity"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ComboItineraryBuilder;
