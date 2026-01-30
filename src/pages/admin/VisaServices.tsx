import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Star, FileText, Zap } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  useAdminVisaServices,
  useDeleteVisaService,
  useUpdateVisaService,
} from "@/hooks/useVisaServices";

const AdminVisaServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: visas, isLoading } = useAdminVisaServices();
  const deleteVisa = useDeleteVisaService();
  const updateVisa = useUpdateVisaService();

  const filteredVisas = visas?.filter(
    (visa) =>
      visa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visa.visa_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteVisa.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = (id: string, isActive: boolean) => {
    updateVisa.mutate({ id, data: { is_active: !isActive } });
  };

  const toggleFeatured = (id: string, isFeatured: boolean) => {
    updateVisa.mutate({ id, data: { is_featured: !isFeatured } });
  };

  // Stats
  const totalVisas = visas?.length || 0;
  const expressVisas = visas?.filter((v) => v.is_express).length || 0;
  const activeVisas = visas?.filter((v) => v.is_active).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Visa Services</h1>
            <p className="text-muted-foreground">
              Manage visa processing services
            </p>
          </div>
          <Link to="/admin/visa-services/add">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Visa Service
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVisas}</p>
                <p className="text-sm text-muted-foreground">Total Visas</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{expressVisas}</p>
                <p className="text-sm text-muted-foreground">Express Services</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeVisas}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search visa services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Visa</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Processing</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredVisas && filteredVisas.length > 0 ? (
                filteredVisas.map((visa) => (
                  <TableRow key={visa.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">{visa.title}</p>
                        {visa.is_express && (
                          <Badge className="bg-amber-100 text-amber-700 mt-1">
                            <Zap className="w-3 h-3 mr-1" />
                            Express
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{visa.visa_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {visa.duration_days ? `${visa.duration_days} days` : "-"}
                    </TableCell>
                    <TableCell>{visa.processing_time || "-"}</TableCell>
                    <TableCell>
                      <span className="font-medium">AED {visa.price.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(visa.id, visa.is_active)}
                        disabled={updateVisa.isPending}
                      >
                        {visa.is_active ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFeatured(visa.id, visa.is_featured)}
                        disabled={updateVisa.isPending}
                      >
                        {visa.is_featured ? (
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        ) : (
                          <Star className="w-5 h-5 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/visa-services/${visa.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/visa-services/edit/${visa.slug}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(visa.id)}
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
                  <TableCell colSpan={8} className="text-center py-12">
                    <p className="text-muted-foreground">No visa services found</p>
                    <Link to="/admin/visa-services/add">
                      <Button className="mt-4" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first visa service
                      </Button>
                    </Link>
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
            <AlertDialogTitle>Delete Visa Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this visa service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminVisaServices;
