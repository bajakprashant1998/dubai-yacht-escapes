import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Upload, X, Plus, Loader2, ImageIcon, Sparkles, MapPin, Calendar, Clock,
  Users, Shield, Flame, RotateCcw, Link as LinkIcon, Ship, ArrowUpDown,
  Info, CheckCircle2, Backpack, AlertCircle, FileText, DollarSign,
  Star, ListChecks, MessageSquare, Search, Settings, Eye, Save
} from "lucide-react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useActiveCategories } from "@/hooks/useCategories";
import { useActiveLocations } from "@/hooks/useLocations";
import ItineraryEditor, { ItineraryItem } from "./ItineraryEditor";
import FAQEditor, { FAQItem } from "./FAQEditor";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import KeywordsInput from "./KeywordsInput";
import RichTextEditor from "./RichTextEditor";
import { BookingFeatures, defaultBookingFeatures, GuestCategory, AddOn } from "@/lib/tourMapper";
import { generateSeoSlug, getCategoryPath } from "@/lib/seoUtils";

type Tour = Tables<"tours">;

// Helper component for important info list editing
const InfoListEditor = ({
  title,
  icon,
  items,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  onChange: (items: string[]) => void;
}) => {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
            <Input
              value={item}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = e.target.value;
                onChange(updated);
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

interface TourFormProps {
  tour?: Tour;
  mode: "create" | "edit";
}

const TourForm = ({ tour, mode }: TourFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Fetch categories and locations from database
  const { data: categories = [], isLoading: categoriesLoading } = useActiveCategories();
  const { data: locations = [], isLoading: locationsLoading } = useActiveLocations();

  // Form state
  const [formData, setFormData] = useState({
    title: tour?.title || "",
    slug: tour?.slug || "",
    seo_slug: (tour as any)?.seo_slug || "",
    subtitle: tour?.subtitle || "",
    description: tour?.description || "",
    long_description: tour?.long_description || "",
    price: tour?.price?.toString() || "",
    original_price: tour?.original_price?.toString() || "",
    pricing_type: (tour as any)?.pricing_type || "per_person",
    full_yacht_price: (tour as any)?.full_yacht_price?.toString() || "",
    duration: tour?.duration || "",
    capacity: tour?.capacity || "",
    category: tour?.category || "dhow",
    location: tour?.location || "",
    featured: tour?.featured || false,
    status: tour?.status || "active",
    image_url: tour?.image_url || "",
    image_alt: tour?.image_alt || "",
    gallery: tour?.gallery || [],
    highlights: tour?.highlights || [],
    included: tour?.included || [],
    excluded: tour?.excluded || [],
    itinerary: (tour?.itinerary as unknown as ItineraryItem[]) || [],
    faqs: (tour?.faqs as unknown as FAQItem[]) || [],
    meta_title: tour?.meta_title || "",
    meta_description: tour?.meta_description || "",
    meta_keywords: tour?.meta_keywords || [],
    booking_features: ((tour as any)?.booking_features as BookingFeatures) || defaultBookingFeatures,
  });

  // Compute form completion percentage
  const completionPercent = useMemo(() => {
    const checks = [
      !!formData.title,
      !!formData.slug,
      !!formData.description,
      !!formData.price,
      !!formData.duration,
      !!formData.category,
      !!formData.image_url,
      (formData.highlights?.length || 0) > 0,
      (formData.included?.length || 0) > 0,
      !!formData.meta_title,
      !!formData.meta_description,
      (formData.gallery?.length || 0) > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formData]);

  // Array field inputs
  const [highlightInput, setHighlightInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
    const { error: uploadError } = await supabase.storage.from("tour-images").upload(fileName, file);
    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("tour-images").getPublicUrl(fileName);
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
      setFormData((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }
    setIsUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery?.filter((_, i) => i !== index) || [] }));
  };

  const addArrayItem = (field: "highlights" | "included" | "excluded", value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return;
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
    setValue("");
  };

  const removeArrayItem = (field: "highlights" | "included" | "excluded", index: number) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field]?.filter((_, i) => i !== index) || [] }));
  };

  const suggestMetaTitle = () => setFormData((prev) => ({ ...prev, meta_title: prev.title.slice(0, 60) }));
  const suggestMetaDescription = () => setFormData((prev) => ({ ...prev, meta_description: (prev.description || "").slice(0, 160) }));
  const suggestImageAlt = () => {
    const alt = [formData.title, formData.location].filter(Boolean).join(" - ");
    setFormData((prev) => ({ ...prev, image_alt: alt }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tourData: TablesInsert<"tours"> | TablesUpdate<"tours"> = {
        title: formData.title,
        slug: formData.slug,
        seo_slug: formData.seo_slug || null,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        long_description: formData.long_description || null,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        pricing_type: formData.pricing_type,
        full_yacht_price: formData.full_yacht_price ? parseFloat(formData.full_yacht_price) : null,
        duration: formData.duration || null,
        capacity: formData.capacity || null,
        category: formData.category,
        location: formData.location || null,
        featured: formData.featured,
        status: formData.status,
        image_url: formData.image_url || null,
        image_alt: formData.image_alt || null,
        gallery: formData.gallery?.length ? formData.gallery : null,
        highlights: formData.highlights?.length ? formData.highlights : null,
        included: formData.included?.length ? formData.included : null,
        excluded: formData.excluded?.length ? formData.excluded : null,
        itinerary: formData.itinerary?.length ? JSON.parse(JSON.stringify(formData.itinerary)) : null,
        faqs: formData.faqs?.length ? JSON.parse(JSON.stringify(formData.faqs)) : null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords?.length ? formData.meta_keywords : null,
        booking_features: JSON.parse(JSON.stringify(formData.booking_features)),
      } as any;

      if (mode === "create") {
        const { error } = await supabase.from("tours").insert(tourData as TablesInsert<"tours">);
        if (error) throw error;
        toast.success("Tour created successfully");
      } else {
        const { error } = await supabase.from("tours").update(tourData as TablesUpdate<"tours">).eq("id", tour?.id);
        if (error) throw error;
        toast.success("Tour updated successfully");
      }
      navigate("/admin/tours");
    } catch (error: any) {
      console.error("Error saving tour:", error);
      toast.error(error.message || "Failed to save tour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabItems = [
    { value: "basic", label: "Basic Info", icon: FileText },
    { value: "pricing", label: "Pricing", icon: DollarSign },
    { value: "content", label: "Content", icon: ListChecks },
    { value: "booking", label: "Booking", icon: Settings },
    { value: "media", label: "Media", icon: ImageIcon },
    { value: "seo", label: "SEO", icon: Search },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Completion Progress + Sticky Top Bar */}
      <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                <span className={completionPercent === 100 ? "text-green-600" : "text-muted-foreground"}>
                  {completionPercent}% complete
                </span>
              </div>
              <Progress value={completionPercent} className="flex-1 h-2" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="featured-top" className="text-sm text-muted-foreground cursor-pointer">Featured</Label>
                <Switch
                  id="featured-top"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
              </div>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-28 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Active</span>
                  </SelectItem>
                  <SelectItem value="draft">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Draft</span>
                  </SelectItem>
                  <SelectItem value="archived">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground" /> Archived</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="sm" className="hidden md:flex" onClick={() => navigate("/admin/tours")}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {mode === "create" ? "Create Tour" : "Update Tour"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl h-auto flex-wrap gap-1">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2.5 text-sm"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ============ TAB: Basic Info ============ */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>The essentials — name, URL, and descriptions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" value={formData.title} onChange={handleTitleChange} placeholder="Enter tour title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input id="slug" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="tour-url-slug" required />
                    </div>
                  </div>

                  {/* SEO-Friendly Slug */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="seo_slug" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        SEO-Friendly URL Slug
                      </Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => {
                        const seoSlug = generateSeoSlug(formData.title, formData.category, formData.location);
                        setFormData((prev) => ({ ...prev, seo_slug: seoSlug }));
                      }}>
                        <Sparkles className="w-4 h-4 mr-1" /> Auto-generate
                      </Button>
                    </div>
                    <Input id="seo_slug" value={formData.seo_slug} onChange={(e) => setFormData((prev) => ({ ...prev, seo_slug: e.target.value }))} placeholder="e.g., luxury-44ft-yacht-charter-dubai-marina" />
                    <p className="text-xs text-muted-foreground">
                      SEO-optimized URL: <span className="font-mono text-secondary">/dubai/{getCategoryPath(formData.category)}/{formData.seo_slug || formData.slug}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input id="subtitle" value={formData.subtitle} onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))} placeholder="Brief tagline" />
                  </div>

                  <RichTextEditor id="description" label="Short Description" value={formData.description} onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))} placeholder="Compelling summary for tour cards…" rows={4} helpText="Used on tour cards and search results." />
                  <RichTextEditor id="long_description" label="Full Description" value={formData.long_description} onChange={(value) => setFormData((prev) => ({ ...prev, long_description: value }))} placeholder="Create a luxurious, detailed description…" rows={12} helpText="Displayed on the tour detail page." />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar — Quick Settings */}
            <div className="space-y-6">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base">Quick Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    {categoriesLoading ? <Skeleton className="h-10 w-full" /> : (
                      <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    {locationsLoading ? <Skeleton className="h-10 w-full" /> : (
                      <Select value={formData.location} onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location">
                            {formData.location && (
                              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{locations.find((l) => l.name === formData.location)?.name || formData.location}</span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.name}>
                              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{loc.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" value={formData.duration} onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))} placeholder="e.g., 2 hours" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" value={formData.capacity} onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))} placeholder="e.g., Up to 10" />
                  </div>
                </CardContent>
              </Card>

              {/* Main Image Preview */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="text-base">Featured Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                  {formData.image_url ? (
                    <div className="relative group">
                      <img src={formData.image_url} alt={formData.image_alt || "Tour"} className="w-full h-40 object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Change</Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => setFormData((prev) => ({ ...prev, image_url: "", image_alt: "" }))}>Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-secondary transition-colors" disabled={isUploadingImage}>
                      {isUploadingImage ? <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" /> : (
                        <>
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload</span>
                        </>
                      )}
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============ TAB: Pricing ============ */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                Pricing & Details
              </CardTitle>
              <CardDescription>Set prices, pricing type, and yacht charter options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (AED) *</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price (AED)</Label>
                  <Input id="original_price" type="number" value={formData.original_price} onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select value={formData.pricing_type} onValueChange={(value) => setFormData((prev) => ({ ...prev, pricing_type: value }))}>
                    <SelectTrigger><SelectValue placeholder="Select pricing type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_person">Per Person</SelectItem>
                      <SelectItem value="per_hour">Per Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Discount preview */}
              {formData.price && formData.original_price && parseFloat(formData.original_price) > parseFloat(formData.price) && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                    {Math.round((1 - parseFloat(formData.price) / parseFloat(formData.original_price)) * 100)}% OFF
                  </Badge>
                  <span className="text-sm text-green-700">
                    Customer saves AED {(parseFloat(formData.original_price) - parseFloat(formData.price)).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_yacht_price">Full Yacht Charter Price (AED)</Label>
                  <Input id="full_yacht_price" type="number" value={formData.full_yacht_price} onChange={(e) => setFormData((prev) => ({ ...prev, full_yacht_price: e.target.value }))} placeholder="Leave empty if N/A" />
                  <p className="text-xs text-muted-foreground">Private charter price for entire yacht</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ TAB: Content ============ */}
        <TabsContent value="content" className="space-y-6">
          {/* Highlights */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary" />
                Highlights
              </CardTitle>
              <CardDescription>Key selling points displayed prominently on the tour card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Add a highlight" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArrayItem("highlights", highlightInput, setHighlightInput); }}} />
                <Button type="button" variant="outline" onClick={() => addArrayItem("highlights", highlightInput, setHighlightInput)}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights?.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                    <Star className="w-3 h-3" />
                    {item}
                    <button type="button" onClick={() => removeArrayItem("highlights", index)} className="hover:text-destructive ml-1"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Included / Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-xl border-green-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={includedInput} onChange={(e) => setIncludedInput(e.target.value)} placeholder="Add included item" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArrayItem("included", includedInput, setIncludedInput); }}} />
                  <Button type="button" variant="outline" onClick={() => addArrayItem("included", includedInput, setIncludedInput)}><Plus className="w-4 h-4" /></Button>
                </div>
                <ul className="space-y-1.5">
                  {formData.included?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm group">
                      <span className="flex items-center gap-2 text-green-700"><CheckCircle2 className="w-3.5 h-3.5" />{item}</span>
                      <button type="button" onClick={() => removeArrayItem("included", index)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-destructive/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <X className="w-5 h-5" />
                  What's Excluded
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={excludedInput} onChange={(e) => setExcludedInput(e.target.value)} placeholder="Add excluded item" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArrayItem("excluded", excludedInput, setExcludedInput); }}} />
                  <Button type="button" variant="outline" onClick={() => addArrayItem("excluded", excludedInput, setExcludedInput)}><Plus className="w-4 h-4" /></Button>
                </div>
                <ul className="space-y-1.5">
                  {formData.excluded?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm group">
                      <span className="flex items-center gap-2 text-destructive"><X className="w-3.5 h-3.5" />{item}</span>
                      <button type="button" onClick={() => removeArrayItem("excluded", index)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Itinerary */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Itinerary
              </CardTitle>
              <CardDescription>Step-by-step timeline of the tour experience</CardDescription>
            </CardHeader>
            <CardContent>
              <ItineraryEditor items={formData.itinerary} onChange={(items) => setFormData((prev) => ({ ...prev, itinerary: items }))} />
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions customers ask about this tour</CardDescription>
            </CardHeader>
            <CardContent>
              <FAQEditor items={formData.faqs} onChange={(items) => setFormData((prev) => ({ ...prev, faqs: items }))} />
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-secondary" />
                  Important Information
                </CardTitle>
                <CardDescription className="mt-1">Customize the information tabs shown on tour detail pages</CardDescription>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, important_info: defaultBookingFeatures.important_info } })); toast.success("Important info reset to defaults"); }} className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-4 h-4" /> Reset
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <InfoListEditor title="Cancellation Policy" icon={<Shield className="w-4 h-4 text-secondary" />} items={formData.booking_features.important_info.cancellation_policy} onChange={(items) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, important_info: { ...prev.booking_features.important_info, cancellation_policy: items } } }))} />
              <InfoListEditor title="What to Bring" icon={<Backpack className="w-4 h-4 text-secondary" />} items={formData.booking_features.important_info.what_to_bring} onChange={(items) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, important_info: { ...prev.booking_features.important_info, what_to_bring: items } } }))} />
              <InfoListEditor title="Good to Know" icon={<AlertCircle className="w-4 h-4 text-secondary" />} items={formData.booking_features.important_info.good_to_know} onChange={(items) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, important_info: { ...prev.booking_features.important_info, good_to_know: items } } }))} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ TAB: Booking ============ */}
        <TabsContent value="booking" className="space-y-6">
          {/* Booking Sidebar Features */}
          <Card className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-secondary" />
                  Booking Sidebar Features
                </CardTitle>
                <CardDescription className="mt-1">Configure urgency banners, quick info, and charter features</CardDescription>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setFormData((prev) => ({ ...prev, booking_features: defaultBookingFeatures })); toast.success("Booking features reset to defaults"); }} className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-4 h-4" /> Reset All
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Urgency Banner */}
              <div className="space-y-3 p-4 bg-destructive/5 border border-destructive/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2"><Flame className="w-4 h-4 text-destructive" />Urgency Banner</Label>
                  <Switch checked={formData.booking_features.urgency_enabled} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, urgency_enabled: checked } }))} />
                </div>
                {formData.booking_features.urgency_enabled && (
                  <Input value={formData.booking_features.urgency_text} onChange={(e) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, urgency_text: e.target.value } }))} placeholder="Only few spots left today!" />
                )}
              </div>

              {/* Quick Info Items */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Quick Info Items</Label>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <Input value={formData.booking_features.availability_text} onChange={(e) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, availability_text: e.target.value } }))} placeholder="Available daily" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-secondary shrink-0" />
                    <Input value={formData.booking_features.minimum_duration} onChange={(e) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, minimum_duration: e.target.value } }))} placeholder="Minimum 2 Hours Required" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3"><Users className="w-4 h-4 text-secondary shrink-0" /><Label>Hotel Pickup</Label></div>
                      <Switch checked={formData.booking_features.hotel_pickup} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, hotel_pickup: checked } }))} />
                    </div>
                    {formData.booking_features.hotel_pickup && (
                      <Input value={formData.booking_features.hotel_pickup_text} onChange={(e) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, hotel_pickup_text: e.target.value } }))} placeholder="Hotel pickup included" className="ml-7" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-secondary shrink-0" />
                    <Input value={formData.booking_features.cancellation_text} onChange={(e) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, cancellation_text: e.target.value } }))} placeholder="Free cancellation (24h)" />
                  </div>
                </div>
              </div>

              {/* Charter Features */}
              <div className="space-y-3 p-4 bg-secondary/5 border border-secondary/10 rounded-xl">
                <Label className="text-sm font-semibold">Private Charter Features</Label>
                <p className="text-xs text-muted-foreground">Appear when "Full Yacht Price" is set</p>
                <div className="space-y-2">
                  {formData.booking_features.charter_features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={feature} onChange={(e) => { const nf = [...formData.booking_features.charter_features]; nf[index] = e.target.value; setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, charter_features: nf } })); }} placeholder="Feature text" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => { const nf = formData.booking_features.charter_features.filter((_, i) => i !== index); setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, charter_features: nf } })); }}><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, charter_features: [...prev.booking_features.charter_features, ""] } }))}><Plus className="w-4 h-4 mr-2" />Add Feature</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Options */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-secondary" />Booking Options</CardTitle>
              <CardDescription>Guest categories, add-ons, and time slots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Label Override */}
              <div className="space-y-2">
                <Label>Price Label Override</Label>
                <Input value={formData.booking_features.price_label_override} onChange={(e) => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, price_label_override: e.target.value } }))} placeholder='Optional: Override "per person" or "per hour"' />
              </div>
              {/* Booking Mode */}
              <div className="space-y-2">
                <Label>Booking Mode</Label>
                <Select value={formData.booking_features.booking_mode} onValueChange={(value: "guest_categories" | "quantity_only") => setFormData((prev) => ({ ...prev, booking_features: { ...prev.booking_features, booking_mode: value } }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest_categories">Guest Categories</SelectItem>
                    <SelectItem value="quantity_only">Quantity Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Guest Categories */}
              {formData.booking_features.booking_mode === "guest_categories" && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Guest Categories</Label>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-muted/50"><th className="px-3 py-2 text-left font-medium">Name</th><th className="px-3 py-2 text-left font-medium">Label</th><th className="px-3 py-2 text-left font-medium">Price</th><th className="px-3 py-2 text-left font-medium">Min</th><th className="px-3 py-2 text-left font-medium">Max</th><th className="px-3 py-2 w-10"></th></tr></thead>
                      <tbody>
                        {formData.booking_features.guest_categories.map((cat, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2"><Input value={cat.name} onChange={(e) => { const u = [...formData.booking_features.guest_categories]; u[index] = { ...u[index], name: e.target.value }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: u } })); }} className="h-8" /></td>
                            <td className="px-3 py-2"><Input value={cat.label} onChange={(e) => { const u = [...formData.booking_features.guest_categories]; u[index] = { ...u[index], label: e.target.value }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: u } })); }} className="h-8" /></td>
                            <td className="px-3 py-2"><Input type="number" value={cat.price} onChange={(e) => { const u = [...formData.booking_features.guest_categories]; u[index] = { ...u[index], price: Number(e.target.value) }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: u } })); }} className="h-8 w-20" /></td>
                            <td className="px-3 py-2"><Input type="number" value={cat.min} onChange={(e) => { const u = [...formData.booking_features.guest_categories]; u[index] = { ...u[index], min: Number(e.target.value) }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: u } })); }} className="h-8 w-16" /></td>
                            <td className="px-3 py-2"><Input type="number" value={cat.max} onChange={(e) => { const u = [...formData.booking_features.guest_categories]; u[index] = { ...u[index], max: Number(e.target.value) }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: u } })); }} className="h-8 w-16" /></td>
                            <td className="px-3 py-2"><Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { const u = formData.booking_features.guest_categories.filter((_, i) => i !== index); setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: u } })); }}><X className="w-4 h-4" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, guest_categories: [...p.booking_features.guest_categories, { name: "", label: "", price: 0, min: 0, max: 10 }] } }))}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
                </div>
              )}

              {/* Add-Ons */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Add-Ons</Label>
                {formData.booking_features.addons.map((addon, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={addon.name} onChange={(e) => { const u = [...formData.booking_features.addons]; u[index] = { ...u[index], name: e.target.value }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, addons: u } })); }} placeholder="Add-on name" className="flex-1" />
                    <Input type="number" value={addon.price} onChange={(e) => { const u = [...formData.booking_features.addons]; u[index] = { ...u[index], price: Number(e.target.value) }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, addons: u } })); }} placeholder="Price" className="w-24" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => { const u = formData.booking_features.addons.filter((_, i) => i !== index); setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, addons: u } })); }}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, addons: [...p.booking_features.addons, { name: "", price: 0 }] } }))}><Plus className="w-4 h-4 mr-2" />Add New Add-On</Button>
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-sm font-semibold"><Clock className="w-4 h-4 text-secondary" />Time Slots</Label>
                  <Switch checked={formData.booking_features.time_slots_enabled} onCheckedChange={(checked) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots_enabled: checked } }))} />
                </div>
                {formData.booking_features.time_slots_enabled && (
                  <div className="space-y-3">
                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-muted/50"><th className="px-3 py-2 text-left font-medium">Label</th><th className="px-3 py-2 text-left font-medium">Start</th><th className="px-3 py-2 text-left font-medium">End</th><th className="px-3 py-2 text-left font-medium">Price Override</th><th className="px-3 py-2 w-10"></th></tr></thead>
                        <tbody>
                          {(formData.booking_features.time_slots || []).map((slot, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-3 py-2"><Input value={slot.label} onChange={(e) => { const u = [...(formData.booking_features.time_slots || [])]; u[index] = { ...u[index], label: e.target.value }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots: u } })); }} placeholder="e.g., Morning" className="h-8" /></td>
                              <td className="px-3 py-2"><Input type="time" value={slot.start_time} onChange={(e) => { const u = [...(formData.booking_features.time_slots || [])]; u[index] = { ...u[index], start_time: e.target.value }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots: u } })); }} className="h-8 w-28" /></td>
                              <td className="px-3 py-2"><Input type="time" value={slot.end_time} onChange={(e) => { const u = [...(formData.booking_features.time_slots || [])]; u[index] = { ...u[index], end_time: e.target.value }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots: u } })); }} className="h-8 w-28" /></td>
                              <td className="px-3 py-2"><Input type="number" value={slot.price_override ?? ""} onChange={(e) => { const u = [...(formData.booking_features.time_slots || [])]; u[index] = { ...u[index], price_override: e.target.value ? Number(e.target.value) : null }; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots: u } })); }} placeholder="Optional" className="h-8 w-24" /></td>
                              <td className="px-3 py-2"><Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { const u = (formData.booking_features.time_slots || []).filter((_, i) => i !== index); setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots: u } })); }}><X className="w-4 h-4" /></Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, time_slots: [...(p.booking_features.time_slots || []), { label: "", start_time: "09:00", end_time: "12:00", price_override: null }] } }))}><Plus className="w-4 h-4 mr-2" />Add Time Slot</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Travel & Deck Options */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Ship className="w-5 h-5 text-secondary" />Travel & Deck Options</CardTitle>
              <CardDescription>Transfer services, travel type, and deck selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Travel Type Selection */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <Label>Enable Travel Type Selection</Label>
                  <Switch checked={formData.booking_features.travel_type_enabled} onCheckedChange={(checked) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, travel_type_enabled: checked } }))} />
                </div>
                {formData.booking_features.travel_type_enabled && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Direct To Boat Discount (AED)</Label>
                      <Input type="number" value={formData.booking_features.direct_to_boat_discount} onChange={(e) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, direct_to_boat_discount: Number(e.target.value) } }))} placeholder="Amount deducted for Self Travelling" />
                    </div>
                  </div>
                )}
              </div>

              {/* Transfer Service */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <Label>Transfer Service Available</Label>
                  <Switch checked={formData.booking_features.transfer_available} onCheckedChange={(checked) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, transfer_available: checked } }))} />
                </div>
                {formData.booking_features.transfer_available && (
                  <div className="space-y-2">
                    <Label>Transfer Label</Label>
                    <Input value={formData.booking_features.transfer_label} onChange={(e) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, transfer_label: e.target.value } }))} placeholder="Hotel/Residence Transfer" />
                  </div>
                )}
              </div>

              {/* Upper Deck */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <Label>Has Upper Deck Option</Label>
                  <Switch checked={formData.booking_features.upper_deck_enabled} onCheckedChange={(checked) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, upper_deck_enabled: checked } }))} />
                </div>
                {formData.booking_features.upper_deck_enabled && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Upper Deck Surcharge (AED)</Label>
                      <Input type="number" value={formData.booking_features.upper_deck_surcharge} onChange={(e) => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, upper_deck_surcharge: Number(e.target.value) } }))} placeholder="Extra charge" />
                    </div>
                    <div className="space-y-2">
                      <Label>Deck Options</Label>
                      {formData.booking_features.deck_options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={option} onChange={(e) => { const u = [...formData.booking_features.deck_options]; u[index] = e.target.value; setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, deck_options: u } })); }} />
                          <Button type="button" variant="ghost" size="icon" onClick={() => { const u = formData.booking_features.deck_options.filter((_, i) => i !== index); setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, deck_options: u } })); }}><X className="w-4 h-4" /></Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => setFormData((p) => ({ ...p, booking_features: { ...p.booking_features, deck_options: [...p.booking_features.deck_options, ""] } }))}><Plus className="w-4 h-4 mr-2" />Add Deck Option</Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ TAB: Media ============ */}
        <TabsContent value="media" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Image */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-secondary" />Main Image</CardTitle>
                <CardDescription>The hero image shown on tour cards and detail pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                {formData.image_url ? (
                  <div className="relative group">
                    <img src={formData.image_url} alt={formData.image_alt || "Tour main image"} className="w-full h-56 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Change</Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => setFormData((prev) => ({ ...prev, image_url: "", image_alt: "" }))}>Remove</Button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-56 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-secondary hover:bg-secondary/5 transition-all" disabled={isUploadingImage}>
                    {isUploadingImage ? <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" /> : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 10MB</p>
                        </div>
                      </>
                    )}
                  </button>
                )}
                {formData.image_url && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="image_alt">Alt Text (SEO)</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={suggestImageAlt} className="h-6 px-2 text-xs"><Sparkles className="w-3 h-3 mr-1" />Auto</Button>
                    </div>
                    <Input id="image_alt" value={formData.image_alt} onChange={(e) => setFormData((prev) => ({ ...prev, image_alt: e.target.value }))} placeholder="Describe the image for accessibility" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-secondary" />Gallery Images</CardTitle>
                <CardDescription>Additional photos shown in the detail page gallery ({formData.gallery?.length || 0} images)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                <div className="grid grid-cols-3 gap-3">
                  {formData.gallery?.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                      <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => galleryInputRef.current?.click()} className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-secondary hover:bg-secondary/5 transition-all" disabled={isUploadingGallery}>
                    {isUploadingGallery ? <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /> : (
                      <>
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-1">Add</span>
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ TAB: SEO ============ */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5 text-secondary" />SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines — meta title, description, and keywords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <div className="flex items-center gap-2">
                    <CharacterCounter current={formData.meta_title.length} min={30} max={60} />
                    <Button type="button" variant="ghost" size="sm" onClick={suggestMetaTitle} className="h-6 px-2 text-xs"><Sparkles className="w-3 h-3 mr-1" />Auto</Button>
                  </div>
                </div>
                <Input id="meta_title" value={formData.meta_title} onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))} placeholder="SEO optimized title (50-60 characters)" maxLength={70} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <div className="flex items-center gap-2">
                    <CharacterCounter current={formData.meta_description.length} min={120} max={160} />
                    <Button type="button" variant="ghost" size="sm" onClick={suggestMetaDescription} className="h-6 px-2 text-xs"><Sparkles className="w-3 h-3 mr-1" />Auto</Button>
                  </div>
                </div>
                <Textarea id="meta_description" value={formData.meta_description} onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))} placeholder="SEO optimized description (150-160 characters)" rows={3} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <KeywordsInput keywords={formData.meta_keywords || []} onChange={(keywords) => setFormData((prev) => ({ ...prev, meta_keywords: keywords }))} />
              </div>
              <div className="space-y-2">
                <Label>Search Result Preview</Label>
                <SEOPreview title={formData.meta_title || formData.title} description={formData.meta_description || formData.description} slug={formData.slug} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default TourForm;
