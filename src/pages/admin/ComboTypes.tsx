import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useComboPackageTypes,
  useCreateComboPackageType,
  useUpdateComboPackageType,
  useDeleteComboPackageType,
  ComboPackageType,
} from "@/hooks/useComboPackageTypes";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Sparkles,
  Users,
  Heart,
  Mountain,
  Crown,
  Plane,
  Briefcase,
  Star,
} from "lucide-react";

const iconOptions = [
  { value: "sparkles", label: "Sparkles", icon: Sparkles },
  { value: "users", label: "Users", icon: Users },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "mountain", label: "Mountain", icon: Mountain },
  { value: "crown", label: "Crown", icon: Crown },
  { value: "plane", label: "Plane", icon: Plane },
  { value: "briefcase", label: "Briefcase", icon: Briefcase },
  { value: "star", label: "Star", icon: Star },
];

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-amber-500", label: "Amber" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-teal-500", label: "Teal" },
];

const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find((opt) => opt.value === iconName);
  return iconOption?.icon || Sparkles;
};

interface TypeFormData {
  name: string;
  slug: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

const initialFormData: TypeFormData = {
  name: "",
  slug: "",
  icon: "sparkles",
  color: "bg-blue-500",
  sort_order: 0,
  is_active: true,
};

const ComboTypes = () => {
  const { toast } = useToast();
  const { data: types = [], isLoading } = useComboPackageTypes();
  const createMutation = useCreateComboPackageType();
  const updateMutation = useUpdateComboPackageType();
  const deleteMutation = useDeleteComboPackageType();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ComboPackageType | null>(null);
  const [formData, setFormData] = useState<TypeFormData>(initialFormData);

  const handleOpenCreate = () => {
    setEditingType(null);
    setFormData({
      ...initialFormData,
      sort_order: types.length + 1,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (type: ComboPackageType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      slug: type.slug,
      icon: type.icon || "sparkles",
      color: type.color || "bg-blue-500",
      sort_order: type.sort_order,
      is_active: type.is_active,
    });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingType ? prev.slug : slug,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and slug are required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingType) {
        await updateMutation.mutateAsync({
          id: editingType.id,
          ...formData,
        });
        toast({ title: "Package type updated successfully" });
      } else {
        await createMutation.mutateAsync(formData);
        toast({ title: "Package type created successfully" });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save package type",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package type?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Package type deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete package type",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Combo Package Types
            </h1>
            <p className="text-muted-foreground">
              Manage package type categories for combo packages
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingType ? "Edit Package Type" : "Add Package Type"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Family Package"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="e.g., family"
                    disabled={!!editingType}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((option) => {
                      const IconComp = option.icon;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant={
                            formData.icon === option.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="flex flex-col h-16 gap-1"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              icon: option.value,
                            }))
                          }
                        >
                          <IconComp className="w-5 h-5" />
                          <span className="text-xs">{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          formData.color === option.value ? "default" : "outline"
                        }
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            color: option.value,
                          }))
                        }
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${option.value}`}
                        />
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {editingType ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Package Types</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : types.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No package types found. Create one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {types.map((type) => {
                    const IconComp = getIconComponent(type.icon || "sparkles");
                    return (
                      <TableRow key={type.id}>
                        <TableCell>
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {type.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {type.slug}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              type.color || "bg-blue-500"
                            }`}
                          >
                            <IconComp className="w-4 h-4 text-white" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`w-6 h-6 rounded-full ${
                              type.color || "bg-blue-500"
                            }`}
                          />
                        </TableCell>
                        <TableCell>{type.sort_order}</TableCell>
                        <TableCell>
                          <Badge
                            variant={type.is_active ? "default" : "secondary"}
                          >
                            {type.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(type)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(type.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ComboTypes;
