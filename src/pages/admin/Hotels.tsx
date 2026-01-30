import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2, Star, Building } from "lucide-react";
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
  useAdminHotels,
  useDeleteHotel,
  useUpdateHotel,
} from "@/hooks/useHotels";

const AdminHotels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: hotels, isLoading } = useAdminHotels();
  const deleteHotel = useDeleteHotel();
  const updateHotel = useUpdateHotel();

  const filteredHotels = hotels?.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteHotel.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const toggleStatus = (id: string, isActive: boolean) => {
    updateHotel.mutate({ id, data: { is_active: !isActive } });
  };

  const toggleFeatured = (id: string, isFeatured: boolean) => {
    updateHotel.mutate({ id, data: { is_featured: !isFeatured } });
  };

  // Stats
  const totalHotels = hotels?.length || 0;
  const featuredHotels = hotels?.filter((h) => h.is_featured).length || 0;
  const fiveStarHotels = hotels?.filter((h) => h.star_rating === 5).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Hotels</h1>
            <p className="text-muted-foreground">
              Manage hotel listings
            </p>
          </div>
          <Link to="/admin/hotels/add">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHotels}</p>
                <p className="text-sm text-muted-foreground">Total Hotels</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredHotels}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{fiveStarHotels}</p>
                <p className="text-sm text-muted-foreground">5-Star Hotels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search hotels..."
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
                <TableHead className="w-[300px]">Hotel</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price From</TableHead>
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
              ) : filteredHotels && filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={hotel.image_url || "/placeholder.svg"}
                          alt={hotel.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium line-clamp-1">{hotel.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {hotel.location || "Dubai"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {hotel.category ? (
                        <Badge variant="outline">{hotel.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: hotel.star_rating || 0 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {hotel.price_from ? (
                        <span className="font-medium">AED {hotel.price_from.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(hotel.id, hotel.is_active)}
                        disabled={updateHotel.isPending}
                      >
                        {hotel.is_active ? (
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
                        onClick={() => toggleFeatured(hotel.id, hotel.is_featured)}
                        disabled={updateHotel.isPending}
                      >
                        {hotel.is_featured ? (
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
                              to={`/hotels/${hotel.category?.toLowerCase() || "all"}/${hotel.slug}`}
                              target="_blank"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/hotels/edit/${hotel.slug}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(hotel.id)}
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
                    <p className="text-muted-foreground">No hotels found</p>
                    <Link to="/admin/hotels/add">
                      <Button className="mt-4" variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first hotel
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
            <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hotel? This action cannot be undone.
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

export default AdminHotels;
