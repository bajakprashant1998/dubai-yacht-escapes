import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Plus, Search } from "lucide-react";
import CategoriesTable from "@/components/admin/CategoriesTable";
import CategoryDialog from "@/components/admin/CategoryDialog";
import {
  useCategoriesWithCounts,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useBulkUpdateCategoryOrder,
  CategoryWithCount,
  CategoryInsert,
  CategoryUpdate,
} from "@/hooks/useCategories";

const AdminCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [localCategories, setLocalCategories] = useState<CategoryWithCount[] | null>(null);

  // Queries and mutations
  const { data: categories = [], isLoading, error } = useCategoriesWithCounts();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const bulkUpdateOrder = useBulkUpdateCategoryOrder();

  // Use local state for optimistic updates during drag, otherwise use fetched data
  const displayCategories = localCategories ?? categories;

  const filteredCategories = displayCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: CategoryWithCount) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSave = (data: CategoryInsert | CategoryUpdate) => {
    if (editingCategory) {
      updateCategory.mutate(
        { ...data, id: editingCategory.id },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingCategory(null);
            setLocalCategories(null);
          },
        }
      );
    } else {
      createCategory.mutate(data as CategoryInsert, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setLocalCategories(null);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        setLocalCategories(null);
      },
    });
  };

  const handleReorder = (reorderedCategories: CategoryWithCount[]) => {
    // Optimistic update
    setLocalCategories(reorderedCategories);

    // Persist to database
    const updates = reorderedCategories.map((cat, index) => ({
      id: cat.id,
      sort_order: index,
    }));

    bulkUpdateOrder.mutate(updates, {
      onSuccess: () => {
        setLocalCategories(null);
      },
      onError: () => {
        setLocalCategories(null);
      },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Tour Categories
            </h1>
            <p className="text-muted-foreground">
              Organize tours into categories. Drag to reorder.
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive rounded-xl p-6 text-center">
            <p>Failed to load categories. Please try again.</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <CategoriesTable
            categories={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={handleReorder}
            isDeleting={deleteCategory.isPending}
            isReordering={bulkUpdateOrder.isPending}
          />
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search query."
                : "Create categories to organize your tours like Dhow Cruises, Private Yachts, and Group Tours."}
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={handleSave}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />
    </AdminLayout>
  );
};

export default AdminCategories;
