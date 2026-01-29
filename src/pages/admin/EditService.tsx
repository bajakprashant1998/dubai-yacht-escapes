import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useService, useUpdateService } from "@/hooks/useServices";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import KeywordsInput from "@/components/admin/KeywordsInput";

const AdminEditService = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading } = useService(slug || "");
  const { data: categories } = useServiceCategories();
  const updateService = useUpdateService();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    long_description: "",
    price: "",
    original_price: "",
    duration: "",
    image_url: "",
    category_id: "",
    meeting_point: "",
    booking_type: "per_person",
    min_participants: "1",
    max_participants: "",
    cancellation_policy: "",
    instant_confirmation: true,
    hotel_pickup: false,
    is_featured: false,
    is_active: true,
    meta_title: "",
    meta_description: "",
  });

  const [highlights, setHighlights] = useState<string[]>([]);
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        slug: service.slug,
        subtitle: service.subtitle || "",
        description: service.description || "",
        long_description: service.longDescription || "",
        price: service.price.toString(),
        original_price: service.originalPrice?.toString() || "",
        duration: service.duration || "",
        image_url: service.imageUrl || "",
        category_id: service.categoryId || "",
        meeting_point: service.meetingPoint || "",
        booking_type: service.bookingType,
        min_participants: service.minParticipants.toString(),
        max_participants: service.maxParticipants?.toString() || "",
        cancellation_policy: service.cancellationPolicy || "",
        instant_confirmation: service.instantConfirmation,
        hotel_pickup: service.hotelPickup,
        is_featured: service.isFeatured,
        is_active: service.isActive,
        meta_title: service.metaTitle || "",
        meta_description: service.metaDescription || "",
      });
      setHighlights(service.highlights);
      setIncluded(service.included);
      setExcluded(service.excluded);
      setMetaKeywords(service.metaKeywords);
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!service) return;

    updateService.mutate(
      {
        id: service.id,
        ...formData,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : undefined,
        min_participants: parseInt(formData.min_participants) || 1,
        max_participants: formData.max_participants
          ? parseInt(formData.max_participants)
          : undefined,
        category_id: formData.category_id || undefined,
        highlights,
        included,
        excluded,
        meta_keywords: metaKeywords,
      },
      {
        onSuccess: () => {
          navigate("/admin/services");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!service) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => navigate("/admin/services")}>
            Back to Services
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/services")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Service</h1>
              <p className="text-muted-foreground">{service.title}</p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={updateService.isPending}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {updateService.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Short Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="long_description">Full Description</Label>
                      <Textarea
                        id="long_description"
                        value={formData.long_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            long_description: e.target.value,
                          })
                        }
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (AED) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price</Label>
                        <Input
                          id="original_price"
                          type="number"
                          value={formData.original_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              original_price: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Pricing Type</Label>
                        <Select
                          value={formData.booking_type}
                          onValueChange={(value) =>
                            setFormData({ ...formData, booking_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per_person">Per Person</SelectItem>
                            <SelectItem value="per_group">Per Group</SelectItem>
                            <SelectItem value="per_vehicle">Per Vehicle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category & Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Active</Label>
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Featured</Label>
                      <Switch
                        checked={formData.is_featured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_featured: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Main Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({ ...formData, image_url: e.target.value })
                        }
                      />
                    </div>
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="mt-4 rounded-lg w-full aspect-video object-cover"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting_point">Meeting Point</Label>
                    <Input
                      id="meeting_point"
                      value={formData.meeting_point}
                      onChange={(e) =>
                        setFormData({ ...formData, meeting_point: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <KeywordsInput
                  keywords={highlights}
                  onChange={setHighlights}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordsInput
                    keywords={included}
                    onChange={setIncluded}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What's Not Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <KeywordsInput
                    keywords={excluded}
                    onChange={setExcluded}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="booking" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_participants">Min Participants</Label>
                    <Input
                      id="min_participants"
                      type="number"
                      value={formData.min_participants}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_participants: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_participants: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                  <Input
                    id="cancellation_policy"
                    value={formData.cancellation_policy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cancellation_policy: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Instant Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Booking is confirmed immediately
                    </p>
                  </div>
                  <Switch
                    checked={formData.instant_confirmation}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, instant_confirmation: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hotel Pickup</Label>
                    <p className="text-sm text-muted-foreground">
                      Includes free hotel pickup
                    </p>
                  </div>
                  <Switch
                    checked={formData.hotel_pickup}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hotel_pickup: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) =>
                      setFormData({ ...formData, meta_title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <KeywordsInput
                    keywords={metaKeywords}
                    onChange={setMetaKeywords}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </AdminLayout>
  );
};

export default AdminEditService;
