import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Package, MoreHorizontal, Edit, Trash2, Eye, Copy, ToggleLeft, ToggleRight } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useComboPackages, useDeleteComboPackage, useToggleComboPackageStatus } from "@/hooks/useComboPackages";

const comboTypeColors: Record<string, string> = {
  essentials: "bg-blue-100 text-blue-700",
  family: "bg-green-100 text-green-700",
  couple: "bg-pink-100 text-pink-700",
  adventure: "bg-orange-100 text-orange-700",
  luxury: "bg-amber-100 text-amber-700",
};

const AdminComboPackages = () => {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: combos, isLoading } = useComboPackages({ activeOnly: false });
  const deleteCombo = useDeleteComboPackage();
  const toggleStatus = useToggleComboPackageStatus();

  const filteredCombos = combos?.filter((combo) =>
    combo.name.toLowerCase().includes(search.toLowerCase()) ||
    combo.combo_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteCombo.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleStatus.mutate({ id, is_active: !currentStatus });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Link to="/admin/combo-packages/ai-rules">
              <Button variant="outline">AI Rules</Button>
            </Link>
            <Link to="/admin/combo-packages/add">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Package
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCombos && filteredCombos.length > 0 ? (
                filteredCombos.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={combo.image_url || "/placeholder.svg"}
                            alt={combo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{combo.name}</p>
                          <p className="text-xs text-muted-foreground">/{combo.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={comboTypeColors[combo.combo_type] || "bg-muted text-muted-foreground"}>
                        {combo.combo_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {combo.duration_days}D / {combo.duration_nights}N
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">AED {combo.final_price_aed.toLocaleString()}</p>
                        {combo.base_price_aed !== combo.final_price_aed && (
                          <p className="text-xs text-muted-foreground line-through">
                            AED {combo.base_price_aed.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {combo.discount_percent > 0 ? (
                        <Badge variant="secondary">{combo.discount_percent}%</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={combo.is_active ? "default" : "secondary"}>
                        {combo.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/combo-packages/${combo.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/combo-packages/edit/${combo.slug}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(combo.id, combo.is_active)}>
                            {combo.is_active ? (
                              <>
                                <ToggleLeft className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(combo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-10 h-10 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No combo packages found</p>
                      <Link to="/admin/combo-packages/add">
                        <Button size="sm" className="mt-2">
                          Create First Package
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Combo Package?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All items associated with this package will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminComboPackages;
