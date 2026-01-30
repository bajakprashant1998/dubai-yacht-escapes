import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Star, Car } from "lucide-react";
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
  useAdminCarRentals,
  useDeleteCarRental,
  useUpdateCarRental,
} from "@/hooks/useCarRentals";

const AdminCarRentals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: cars, isLoading } = useAdminCarRentals();
  const deleteCar = useDeleteCarRental();
  const updateCar = useUpdateCarRental();

  const filteredCars = cars?.filter(
    (car) =>
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteCar.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = (id: string, isActive: boolean) => {
    updateCar.mutate({ id, data: { is_active: !isActive } });
  };

  const toggleFeatured = (id: string, isFeatured: boolean) => {
    updateCar.mutate({ id, data: { is_featured: !isFeatured } });
  };

  // Stats
  const totalCars = cars?.length || 0;
  const featuredCars = cars?.filter((c) => c.is_featured).length || 0;
  const activeCars = cars?.filter((c) => c.is_active).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Car Rentals</h1>
            <p className="text-muted-foreground">
              Manage your car rental fleet
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/car-rentals/categories">
              <Button variant="outline">
                Categories
              </Button>
            </Link>
            <Link to="/admin/car-rentals/add">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Car
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCars}</p>
                <p className="text-sm text-muted-foreground">Total Cars</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredCars}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Car className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCars}</p>
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
              placeholder="Search cars..."
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
                <TableHead className="w-[300px]">Car</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Daily Price</TableHead>
                <TableHead>Transmission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCars && filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image_url || "/placeholder.svg"}
                          alt={car.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium line-clamp-1">{car.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {car.brand} • {car.year}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {car.category ? (
                        <Badge variant="outline">{car.category.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">AED {car.daily_price.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>{car.transmission}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(car.id, car.is_active)}
                        disabled={updateCar.isPending}
                      >
                        {car.is_active ? (
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
                        onClick={() => toggleFeatured(car.id, car.is_featured)}
                        disabled={updateCar.isPending}
                      >
                        {car.is_featured ? (
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
                            <Link
                              to={`/car-rentals/${car.category?.slug || "all"}/${car.slug}`}
                              target="_blank"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/car-rentals/edit/${car.slug}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(car.id)}
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
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-muted-foreground">No cars found</p>
                    <Link to="/admin/car-rentals/add">
                      <Button className="mt-4" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first car
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
            <AlertDialogTitle>Delete Car</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this car? This action cannot be undone.
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

export default AdminCarRentals;
