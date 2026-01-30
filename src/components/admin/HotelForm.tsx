import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Plus, Loader2, Star } from "lucide-react";
import { useCreateHotel, useUpdateHotel, Hotel } from "@/hooks/useHotels";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import RichTextEditor from "./RichTextEditor";

interface HotelFormProps {
  hotel?: Hotel;
  mode: "create" | "edit";
}

const hotelCategories = ["Budget", "3-Star", "4-Star", "5-Star", "Luxury", "Resort", "Boutique"];

const HotelForm = ({ hotel, mode }: HotelFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();

  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    slug: hotel?.slug || "",
    category: hotel?.category || "",
    star_rating: hotel?.star_rating?.toString() || "5",
    location: hotel?.location || "",
    address: hotel?.address || "",
    latitude: hotel?.latitude?.toString() || "",
    longitude: hotel?.longitude?.toString() || "",
    description: hotel?.description || "",
    long_description: hotel?.long_description || "",
    amenities: hotel?.amenities || [],
    highlights: hotel?.highlights || [],
    price_from: hotel?.price_from?.toString() || "",
    contact_phone: hotel?.contact_phone || "",
    contact_email: hotel?.contact_email || "",
    check_in_time: hotel?.check_in_time || "15:00",
    check_out_time: hotel?.check_out_time || "12:00",
    image_url: hotel?.image_url || "",
    gallery: hotel?.gallery || [],
    is_featured: hotel?.is_featured || false,
    is_active: hotel?.is_active ?? true,
    meta_title: hotel?.meta_title || "",
    meta_description: hotel?.meta_description || "",
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? generateSlug(name) : prev.slug,
    }));
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("hotel-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("hotel-images")
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
    field: "amenities" | "highlights",
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

  const removeArrayItem = (field: "amenities" | "highlights", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hotelData = {
      name: formData.name,
      slug: formData.slug,
      category: formData.category || "",
      star_rating: parseInt(formData.star_rating) || 5,
      location: formData.location || null,
      address: formData.address || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      description: formData.description || null,
      long_description: formData.long_description || null,
      amenities: formData.amenities?.length ? formData.amenities : [],
      highlights: formData.highlights?.length ? formData.highlights : [],
      price_from: formData.price_from ? parseFloat(formData.price_from) : null,
      contact_phone: formData.contact_phone || null,
      contact_email: formData.contact_email || null,
      check_in_time: formData.check_in_time || "15:00",
      check_out_time: formData.check_out_time || "12:00",
      image_url: formData.image_url || null,
      gallery: formData.gallery?.length ? formData.gallery : [],
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      sort_order: hotel?.sort_order || 0,
    };

    if (mode === "create") {
      createHotel.mutate(hotelData, {
        onSuccess: () => navigate("/admin/hotels"),
      });
    } else if (hotel) {
      updateHotel.mutate({ id: hotel.id, data: hotelData }, {
        onSuccess: () => navigate("/admin/hotels"),
      });
    }
  };

  const isSubmitting = createHotel.isPending || updateHotel.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g., Atlantis The Palm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="atlantis-the-palm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {hotelCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Star Rating</Label>
                  <Select
                    value={formData.star_rating}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, star_rating: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <RichTextEditor
                id="description"
                label="Short Description"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                placeholder="Brief hotel description..."
                rows={3}
              />

              <RichTextEditor
                id="long_description"
                label="Full Description"
                value={formData.long_description}
                onChange={(value) => setFormData((prev) => ({ ...prev, long_description: value }))}
                placeholder="Detailed hotel description..."
                rows={8}
              />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Area/Neighborhood</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Palm Jumeirah"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value }))}
                    placeholder="25.1304"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value }))}
                    placeholder="55.1171"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_from">Price From (AED)</Label>
                  <Input
                    id="price_from"
                    type="number"
                    value={formData.price_from}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price_from: e.target.value }))}
                    placeholder="Starting price per night"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_in_time">Check-in Time</Label>
                  <Input
                    id="check_in_time"
                    type="time"
                    value={formData.check_in_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, check_in_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_out_time">Check-out Time</Label>
                  <Input
                    id="check_out_time"
                    type="time"
                    value={formData.check_out_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, check_out_time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="+971 4 xxx xxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="info@hotel.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities & Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amenities */}
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g., Swimming Pool, WiFi, Gym"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("amenities", amenityInput, setAmenityInput))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("amenities", amenityInput, setAmenityInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities?.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeArrayItem("amenities", i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <Label>Highlights</Label>
                <div className="flex gap-2">
                  <Input
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g., Beachfront location, Award-winning spa"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("highlights", highlightInput, setHighlightInput))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("highlights", highlightInput, setHighlightInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights?.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeArrayItem("highlights", i)}>
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
                      alt="Hotel"
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
                title={formData.meta_title || formData.name}
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
              {mode === "create" ? "Create Hotel" : "Update Hotel"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/hotels")}
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

export default HotelForm;
