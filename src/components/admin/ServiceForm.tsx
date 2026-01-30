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
import { Upload, X, Plus, Loader2, ImageIcon, Sparkles, MapPin } from "lucide-react";
import { useServiceCategories } from "@/hooks/useServiceCategories";
import { useActiveLocations } from "@/hooks/useLocations";
import { useCreateService, useUpdateService } from "@/hooks/useServices";
import ItineraryEditor, { ItineraryItem } from "./ItineraryEditor";
import FAQEditor, { FAQItem } from "./FAQEditor";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import KeywordsInput from "./KeywordsInput";
import RichTextEditor from "./RichTextEditor";
import type { Service } from "@/lib/serviceMapper";

interface ServiceFormProps {
  service?: Service;
  mode: "create" | "edit";
}

const ServiceForm = ({ service, mode }: ServiceFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const createService = useCreateService();
  const updateService = useUpdateService();

  // Fetch categories and locations from database
  const { data: categories = [], isLoading: categoriesLoading } = useServiceCategories();
  const { data: locations = [], isLoading: locationsLoading } = useActiveLocations();

  // Form state
  const [formData, setFormData] = useState({
    title: service?.title || "",
    slug: service?.slug || "",
    subtitle: service?.subtitle || "",
    description: service?.description || "",
    long_description: service?.longDescription || "",
    price: service?.price?.toString() || "",
    original_price: service?.originalPrice?.toString() || "",
    duration: service?.duration || "",
    booking_type: service?.bookingType || "per_person",
    category_id: service?.categoryId || "",
    location: service?.location || "",
    meeting_point: service?.meetingPoint || "",
    min_participants: service?.minParticipants?.toString() || "1",
    max_participants: service?.maxParticipants?.toString() || "",
    cancellation_policy: service?.cancellationPolicy || "Free cancellation up to 24 hours before",
    instant_confirmation: service?.instantConfirmation ?? true,
    hotel_pickup: service?.hotelPickup ?? false,
    is_featured: service?.isFeatured || false,
    is_active: service?.isActive ?? true,
    image_url: service?.imageUrl || "",
    image_alt: service?.imageAlt || "",
    gallery: service?.gallery || [],
    highlights: service?.highlights || [],
    included: service?.included || [],
    excluded: service?.excluded || [],
    itinerary: service?.itinerary || [],
    faqs: service?.faqs || [],
    meta_title: service?.metaTitle || "",
    meta_description: service?.metaDescription || "",
    meta_keywords: service?.metaKeywords || [],
  });

  // Array field inputs
  const [highlightInput, setHighlightInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");

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
      .from("service-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("service-images")
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
      if (url) {
        uploadedUrls.push(url);
      }
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
    field: "highlights" | "included" | "excluded",
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

  const removeArrayItem = (field: "highlights" | "included" | "excluded", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  // SEO auto-suggest functions
  const suggestMetaTitle = () => {
    setFormData((prev) => ({
      ...prev,
      meta_title: prev.title.slice(0, 60),
    }));
  };

  const suggestMetaDescription = () => {
    setFormData((prev) => ({
      ...prev,
      meta_description: (prev.description || "").slice(0, 160),
    }));
  };

  const suggestImageAlt = () => {
    const alt = [formData.title, formData.location].filter(Boolean).join(" - ");
    setFormData((prev) => ({ ...prev, image_alt: alt }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      title: formData.title,
      slug: formData.slug,
      subtitle: formData.subtitle || null,
      description: formData.description || null,
      long_description: formData.long_description || null,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      duration: formData.duration || null,
      booking_type: formData.booking_type,
      category_id: formData.category_id || null,
      location: formData.location || null,
      meeting_point: formData.meeting_point || null,
      min_participants: parseInt(formData.min_participants) || 1,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      cancellation_policy: formData.cancellation_policy || null,
      instant_confirmation: formData.instant_confirmation,
      hotel_pickup: formData.hotel_pickup,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      image_url: formData.image_url || null,
      image_alt: formData.image_alt || null,
      gallery: formData.gallery?.length ? formData.gallery : null,
      highlights: formData.highlights?.length ? formData.highlights : null,
      included: formData.included?.length ? formData.included : null,
      excluded: formData.excluded?.length ? formData.excluded : null,
      itinerary: formData.itinerary?.length ? formData.itinerary : null,
      faqs: formData.faqs?.length ? formData.faqs : null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      meta_keywords: formData.meta_keywords?.length ? formData.meta_keywords : null,
    };

    if (mode === "create") {
      createService.mutate(serviceData as any, {
        onSuccess: () => navigate("/admin/services"),
      });
    } else if (service) {
      updateService.mutate({ id: service.id, ...serviceData } as any, {
        onSuccess: () => navigate("/admin/services"),
      });
    }
  };

  const isSubmitting = createService.isPending || updateService.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter service title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="service-url-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Brief tagline"
                />
              </div>

              <RichTextEditor
                id="description"
                label="Short Description"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                placeholder="Compelling summary for cards. Use **bold** for key features."
                rows={4}
                helpText="Used on cards and search results. Keep it concise and engaging."
              />

              <RichTextEditor
                id="long_description"
                label="Full Description"
                value={formData.long_description}
                onChange={(value) => setFormData((prev) => ({ ...prev, long_description: value }))}
                placeholder="Create a detailed description using the formatting toolbar..."
                rows={12}
                helpText="Displayed on the service detail page. Use headings, lists, and links."
              />
            </CardContent>
          </Card>

          {/* Pricing & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (AED) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                    placeholder="For showing discount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select
                    value={formData.booking_type}
                    onValueChange={(value: "per_person" | "per_group" | "per_vehicle") => setFormData((prev) => ({ ...prev, booking_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_person">Per Person</SelectItem>
                      <SelectItem value="per_group">Per Group</SelectItem>
                      <SelectItem value="per_vehicle">Per Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 6 Hours"
                  />
                </div>
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
                  <Label>Location</Label>
                  {locationsLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location">
                          {formData.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {locations.find((l) => l.name === formData.location)?.name || formData.location}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.name}>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {loc.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting_point">Meeting Point</Label>
                  <Input
                    id="meeting_point"
                    value={formData.meeting_point}
                    onChange={(e) => setFormData((prev) => ({ ...prev, meeting_point: e.target.value }))}
                    placeholder="e.g., Hotel lobby"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_participants">Min Participants</Label>
                  <Input
                    id="min_participants"
                    type="number"
                    value={formData.min_participants}
                    onChange={(e) => setFormData((prev) => ({ ...prev, min_participants: e.target.value }))}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData((prev) => ({ ...prev, max_participants: e.target.value }))}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                <Input
                  id="cancellation_policy"
                  value={formData.cancellation_policy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cancellation_policy: e.target.value }))}
                  placeholder="Free cancellation up to 24 hours before"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.instant_confirmation}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, instant_confirmation: checked }))}
                  />
                  <Label>Instant Confirmation</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.hotel_pickup}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, hotel_pickup: checked }))}
                  />
                  <Label>Hotel Pickup</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Add a highlight"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("highlights", highlightInput, setHighlightInput);
                    }
                  }}
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
                {formData.highlights?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("highlights", index)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Included/Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={includedInput}
                    onChange={(e) => setIncludedInput(e.target.value)}
                    placeholder="Add included item"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("included", includedInput, setIncludedInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("included", includedInput, setIncludedInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="space-y-1">
                  {formData.included?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="text-emerald-600">✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("included", index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Excluded</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={excludedInput}
                    onChange={(e) => setExcludedInput(e.target.value)}
                    placeholder="Add excluded item"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("excluded", excludedInput, setExcludedInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("excluded", excludedInput, setExcludedInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ul className="space-y-1">
                  {formData.excluded?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="text-destructive">✗ {item}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem("excluded", index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <ItineraryEditor
                items={formData.itinerary as ItineraryItem[]}
                onChange={(items) => setFormData((prev) => ({ ...prev, itinerary: items }))}
              />
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <FAQEditor
                items={formData.faqs as FAQItem[]}
                onChange={(items) => setFormData((prev) => ({ ...prev, faqs: items }))}
              />
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={suggestMetaTitle}
                    className="h-7"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Auto-fill
                  </Button>
                </div>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO optimized title"
                />
                <CharacterCounter current={formData.meta_title.length} max={60} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={suggestMetaDescription}
                    className="h-7"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Auto-fill
                  </Button>
                </div>
                <Input
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO optimized description"
                />
                <CharacterCounter current={formData.meta_description.length} max={160} />
              </div>

              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <KeywordsInput
                  keywords={formData.meta_keywords}
                  onChange={(keywords) => setFormData((prev) => ({ ...prev, meta_keywords: keywords }))}
                />
              </div>

              <SEOPreview
                title={formData.meta_title || formData.title}
                description={formData.meta_description || formData.description}
                slug={formData.slug}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Card */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : mode === "create" ? (
                  "Create Service"
                ) : (
                  "Update Service"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Main Image */}
          <Card>
            <CardHeader>
              <CardTitle>Main Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageUpload}
              />

              {formData.image_url ? (
                <div className="space-y-2">
                  <img
                    src={formData.image_url}
                    alt={formData.image_alt || "Preview"}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6" />
                      <span>Upload Image</span>
                    </>
                  )}
                </Button>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="image_alt">Alt Text</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={suggestImageAlt}
                    className="h-6 text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Suggest
                  </Button>
                </div>
                <Input
                  id="image_alt"
                  value={formData.image_alt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_alt: e.target.value }))}
                  placeholder="Describe the image"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />

              {formData.gallery?.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploadingGallery}
              >
                {isUploadingGallery ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4 mr-2" />
                )}
                Add Images
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default ServiceForm;
