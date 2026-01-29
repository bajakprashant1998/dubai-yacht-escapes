import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { useCreateService } from "@/hooks/useServices";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import KeywordsInput from "@/components/admin/KeywordsInput";

const AdminAddService = () => {
  const navigate = useNavigate();
  const { data: categories } = useServiceCategories();
  const createService = useCreateService();

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
    cancellation_policy: "Free cancellation up to 24 hours before",
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createService.mutate(
      {
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
              <h1 className="text-2xl font-bold">Add Service</h1>
              <p className="text-muted-foreground">
                Create a new experience or activity
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={createService.isPending}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {createService.isPending ? "Saving..." : "Save Service"}
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
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g., Evening Desert Safari"
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
                          placeholder="evening-desert-safari"
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
                        placeholder="Short tagline for the service"
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
                        placeholder="Brief description shown in cards"
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
                        placeholder="Detailed description shown on the service page"
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
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price (AED)</Label>
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
                          placeholder="For showing discount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booking_type">Pricing Type</Label>
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
                        placeholder="https://..."
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
                      placeholder="e.g., 6 Hours"
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
                      placeholder="e.g., Hotel lobby"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Key features of this experience</CardDescription>
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
                      placeholder="Leave empty for unlimited"
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
                <CardDescription>
                  Optimize for search engines
                </CardDescription>
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
                    placeholder="SEO title (defaults to service title)"
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
                    placeholder="SEO description"
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

export default AdminAddService;
