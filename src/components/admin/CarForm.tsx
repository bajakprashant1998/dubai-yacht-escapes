import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { useCarCategories } from "@/hooks/useCarCategories";
import { useCreateCarRental, useUpdateCarRental } from "@/hooks/useCarRentals";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import RichTextEditor from "./RichTextEditor";
import type { CarRental } from "@/hooks/useCarRentals";

interface CarFormProps {
  car?: CarRental;
  mode: "create" | "edit";
}

const CarForm = ({ car, mode }: CarFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const createCar = useCreateCarRental();
  const updateCar = useUpdateCarRental();
  const { data: categories = [], isLoading: categoriesLoading } = useCarCategories();

  const [formData, setFormData] = useState({
    title: car?.title || "",
    slug: car?.slug || "",
    brand: car?.brand || "",
    model: car?.model || "",
    year: car?.year?.toString() || new Date().getFullYear().toString(),
    category_id: car?.category_id || "",
    seats: car?.seats?.toString() || "5",
    transmission: car?.transmission || "Automatic",
    fuel_type: car?.fuel_type || "Petrol",
    daily_price: car?.daily_price?.toString() || "",
    weekly_price: car?.weekly_price?.toString() || "",
    monthly_price: car?.monthly_price?.toString() || "",
    deposit: car?.deposit?.toString() || "",
    driver_available: car?.driver_available ?? true,
    self_drive: car?.self_drive ?? true,
    features: car?.features || [],
    requirements: car?.requirements || [],
    image_url: car?.image_url || "",
    gallery: car?.gallery || [],
    description: car?.description || "",
    long_description: car?.long_description || "",
    is_featured: car?.is_featured || false,
    is_active: car?.is_active ?? true,
    meta_title: car?.meta_title || "",
    meta_description: car?.meta_description || "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generateSlug(title) : prev.slug,
    }));
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("car-images")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const url = await uploadImage(file, "main");
    if (url) {
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast.success("Image uploaded successfully");
    }
    setIsUploadingImage(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImage(file, "gallery");
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }
    setIsUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || [],
    }));
  };

  const addArrayItem = (
    field: "features" | "requirements",
    value: string,
    setValue: (v: string) => void
  ) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
    setValue("");
  };

  const removeArrayItem = (field: "features" | "requirements", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const carData = {
      title: formData.title,
      slug: formData.slug,
      brand: formData.brand,
      model: formData.model,
      year: parseInt(formData.year) || new Date().getFullYear(),
      category_id: formData.category_id || null,
      seats: parseInt(formData.seats) || 5,
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,
      daily_price: parseFloat(formData.daily_price) || 0,
      weekly_price: formData.weekly_price ? parseFloat(formData.weekly_price) : null,
      monthly_price: formData.monthly_price ? parseFloat(formData.monthly_price) : null,
      deposit: formData.deposit ? parseFloat(formData.deposit) : 0,
      driver_available: formData.driver_available,
      self_drive: formData.self_drive,
      features: formData.features?.length ? formData.features : [],
      requirements: formData.requirements?.length ? formData.requirements : [],
      image_url: formData.image_url || null,
      gallery: formData.gallery?.length ? formData.gallery : [],
      description: formData.description || null,
      long_description: formData.long_description || null,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      sort_order: car?.sort_order || 0,
    };

    if (mode === "create") {
      createCar.mutate(carData, {
        onSuccess: () => navigate("/admin/car-rentals"),
      });
    } else if (car) {
      updateCar.mutate({ id: car.id, data: carData }, {
        onSuccess: () => navigate("/admin/car-rentals"),
      });
    }
  };

  const isSubmitting = createCar.isPending || updateCar.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Car Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g., Toyota Camry 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="toyota-camry-2024"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                    placeholder="Camry"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                    required
                  />
                </div>
              </div>

              <RichTextEditor
                id="description"
                label="Short Description"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                placeholder="Brief car description for listings..."
                rows={3}
              />

              <RichTextEditor
                id="long_description"
                label="Full Description"
                value={formData.long_description}
                onChange={(value) => setFormData((prev) => ({ ...prev, long_description: value }))}
                placeholder="Detailed car description..."
                rows={8}
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  {categoriesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seats: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, transmission: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select
                    value={formData.fuel_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, fuel_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    id="driver_available"
                    checked={formData.driver_available}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, driver_available: checked }))}
                  />
                  <Label htmlFor="driver_available">Driver Available</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="self_drive"
                    checked={formData.self_drive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, self_drive: checked }))}
                  />
                  <Label htmlFor="self_drive">Self Drive</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing (AED)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily_price">Daily Price *</Label>
                  <Input
                    id="daily_price"
                    type="number"
                    value={formData.daily_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, daily_price: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekly_price">Weekly Price</Label>
                  <Input
                    id="weekly_price"
                    type="number"
                    value={formData.weekly_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, weekly_price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_price">Monthly Price</Label>
                  <Input
                    id="monthly_price"
                    type="number"
                    value={formData.monthly_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, monthly_price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deposit: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g., Bluetooth, GPS, Sunroof"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("features", featureInput, setFeatureInput))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("features", featureInput, setFeatureInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features?.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeArrayItem("features", i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <Label>Requirements</Label>
                <div className="flex gap-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="e.g., Valid UAE license, Age 21+"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("requirements", requirementInput, setRequirementInput))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("requirements", requirementInput, setRequirementInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements?.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeArrayItem("requirements", i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Image */}
              <div className="space-y-2">
                <Label>Main Image</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMainImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {formData.image_url ? (
                  <div className="relative w-full h-48">
                    <img
                      src={formData.image_url}
                      alt="Car"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <Label>Gallery</Label>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <div className="grid grid-cols-4 gap-4">
                  {formData.gallery?.map((url, i) => (
                    <div key={i} className="relative aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6"
                        onClick={() => removeGalleryImage(i)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                  >
                    {isUploadingGallery ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <CharacterCounter current={formData.meta_title.length} max={60} />
                </div>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO page title"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <CharacterCounter current={formData.meta_description.length} max={160} />
                </div>
                <Input
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO page description"
                />
              </div>

              <SEOPreview
                title={formData.meta_title || formData.title}
                description={formData.meta_description || formData.description}
                slug={formData.slug}
                baseUrl="rentalyachtindubai.com"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Car" : "Update Car"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/car-rentals")}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CarForm;
