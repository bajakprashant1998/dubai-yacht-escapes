import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Upload, X, Plus, Loader2, Star, Building, MapPin, Phone, Image,
  Search, CheckCircle2, AlertCircle, Eye, Save, GripVertical,
} from "lucide-react";
import { useCreateHotel, useUpdateHotel, Hotel } from "@/hooks/useHotels";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import RichTextEditor from "./RichTextEditor";

interface HotelFormProps {
  hotel?: Hotel;
  mode: "create" | "edit";
}

const hotelCategories = ["Budget", "3-Star", "4-Star", "5-Star", "Luxury", "Resort", "Boutique"];

const commonAmenities = [
  "Free WiFi", "Swimming Pool", "Gym/Fitness Center", "Spa & Wellness", "Restaurant",
  "Room Service", "Parking", "Airport Shuttle", "Business Center", "Kids Club",
  "Beach Access", "Concierge", "Laundry Service", "Bar/Lounge", "Pet Friendly",
];

const HotelForm = ({ hotel, mode }: HotelFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

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

  // Completion tracker
  const completionPercent = useMemo(() => {
    const fields = [
      !!formData.name, !!formData.slug, !!formData.category,
      !!formData.description, !!formData.location, !!formData.address,
      !!formData.image_url, formData.amenities.length > 0,
      formData.highlights.length > 0, !!formData.price_from,
      !!formData.contact_phone || !!formData.contact_email,
      !!formData.meta_title, !!formData.meta_description,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [formData]);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
    const { error: uploadError } = await supabase.storage.from("hotel-images").upload(fileName, file);
    if (uploadError) { toast.error("Failed to upload image"); return null; }
    const { data: { publicUrl } } = supabase.storage.from("hotel-images").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    const url = await uploadImage(file, "main");
    if (url) { setFormData((prev) => ({ ...prev, image_url: url })); toast.success("Image uploaded"); }
    setIsUploadingImage(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setIsUploadingGallery(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, "gallery");
      if (url) uploaded.push(url);
    }
    if (uploaded.length) {
      setFormData((prev) => ({ ...prev, gallery: [...(prev.gallery || []), ...uploaded] }));
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    setIsUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) =>
    setFormData((prev) => ({ ...prev, gallery: prev.gallery?.filter((_, i) => i !== index) || [] }));

  const addArrayItem = (field: "amenities" | "highlights", value: string, setValue: (v: string) => void) => {
    if (!value.trim()) return;
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
    setValue("");
  };

  const removeArrayItem = (field: "amenities" | "highlights", index: number) =>
    setFormData((prev) => ({ ...prev, [field]: prev[field]?.filter((_, i) => i !== index) || [] }));

  const toggleCommonAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      setActiveTab("basic");
      return;
    }

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
      createHotel.mutate(hotelData, { onSuccess: () => navigate("/admin/hotels") });
    } else if (hotel) {
      updateHotel.mutate({ id: hotel.id, data: hotelData }, { onSuccess: () => navigate("/admin/hotels") });
    }
  };

  const isSubmitting = createHotel.isPending || updateHotel.isPending;

  const tabItems = [
    { value: "basic", label: "Basic Info", icon: Building },
    { value: "location", label: "Location & Contact", icon: MapPin },
    { value: "amenities", label: "Amenities", icon: CheckCircle2 },
    { value: "media", label: "Media", icon: Image },
    { value: "seo", label: "SEO", icon: Search },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b -mx-6 px-6 py-3 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={completionPercent >= 80 ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                    strokeWidth="3" strokeDasharray={`${completionPercent * 0.94} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                  {completionPercent}%
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{formData.name || "Untitled Hotel"}</p>
                <p className="text-xs text-muted-foreground">
                  {completionPercent >= 80 ? "Ready to publish" : "Keep filling details"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 mr-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bar-active" className="text-sm cursor-pointer">Active</Label>
                <Switch
                  id="bar-active"
                  checked={formData.is_active}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, is_active: c }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="bar-featured" className="text-sm cursor-pointer">Featured</Label>
                <Switch
                  id="bar-featured"
                  checked={formData.is_featured}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, is_featured: c }))}
                />
              </div>
            </div>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/hotels")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Hotel" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto mb-6 overflow-x-auto">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* === BASIC INFO === */}
        <TabsContent value="basic" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Details</CardTitle>
                  <CardDescription>Enter the core hotel information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Hotel Name *</Label>
                      <Input id="name" value={formData.name} onChange={handleNameChange} placeholder="e.g., Atlantis The Palm" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <div className="relative">
                        <Input id="slug" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} placeholder="atlantis-the-palm" required className="pl-16" />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hotels/</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {hotelCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Star Rating</Label>
                      <div className="flex items-center gap-1 pt-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, star_rating: r.toString() }))}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 ${parseInt(formData.star_rating) >= r ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">{formData.star_rating} Star</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_from">Starting Price (AED/night)</Label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">AED</span>
                      <Input
                        id="price_from" type="number" value={formData.price_from}
                        onChange={(e) => setFormData((p) => ({ ...p, price_from: e.target.value }))}
                        placeholder="0" className="pl-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                  <CardDescription>Write compelling content for the hotel listing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichTextEditor
                    id="description" label="Short Description"
                    value={formData.description}
                    onChange={(v) => setFormData((p) => ({ ...p, description: v }))}
                    placeholder="Brief overview shown in cards and search results..." rows={3}
                  />
                  <RichTextEditor
                    id="long_description" label="Full Description"
                    value={formData.long_description}
                    onChange={(v) => setFormData((p) => ({ ...p, long_description: v }))}
                    placeholder="Detailed hotel description for the detail page..." rows={8}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Preview Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-sm">Preview Card</CardTitle></CardHeader>
                <CardContent>
                  <div className="border rounded-xl overflow-hidden">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-muted flex items-center justify-center">
                        <Image className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: parseInt(formData.star_rating) || 0 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="font-semibold text-sm line-clamp-1">{formData.name || "Hotel Name"}</p>
                      <p className="text-xs text-muted-foreground">{formData.location || "Location"}</p>
                      {formData.price_from && (
                        <p className="text-sm font-bold text-primary">From AED {Number(formData.price_from).toLocaleString()}/night</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile status toggles */}
              <Card className="md:hidden">
                <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mob-active">Active</Label>
                    <Switch id="mob-active" checked={formData.is_active} onCheckedChange={(c) => setFormData((p) => ({ ...p, is_active: c }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mob-featured">Featured</Label>
                    <Switch id="mob-featured" checked={formData.is_featured} onCheckedChange={(c) => setFormData((p) => ({ ...p, is_featured: c }))} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* === LOCATION & CONTACT === */}
        <TabsContent value="location" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Area / Neighborhood</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} placeholder="e.g., Palm Jumeirah" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea id="address" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} placeholder="Complete street address" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" value={formData.latitude} onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))} placeholder="25.1304" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" value={formData.longitude} onChange={(e) => setFormData((p) => ({ ...p, longitude: e.target.value }))} placeholder="55.1171" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" /> Contact & Check-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input id="contact_phone" value={formData.contact_phone} onChange={(e) => setFormData((p) => ({ ...p, contact_phone: e.target.value }))} placeholder="+971 4 xxx xxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input id="contact_email" type="email" value={formData.contact_email} onChange={(e) => setFormData((p) => ({ ...p, contact_email: e.target.value }))} placeholder="reservations@hotel.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check_in_time">Check-in Time</Label>
                    <Input id="check_in_time" type="time" value={formData.check_in_time} onChange={(e) => setFormData((p) => ({ ...p, check_in_time: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check_out_time">Check-out Time</Label>
                    <Input id="check_out_time" type="time" value={formData.check_out_time} onChange={(e) => setFormData((p) => ({ ...p, check_out_time: e.target.value }))} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === AMENITIES & HIGHLIGHTS === */}
        <TabsContent value="amenities" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Click common amenities or add custom ones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick-add grid */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Quick Add</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonAmenities.map((a) => {
                      const selected = formData.amenities.includes(a);
                      return (
                        <button
                          key={a} type="button"
                          onClick={() => toggleCommonAmenity(a)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:border-primary/50"
                          }`}
                        >
                          {selected && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom amenity */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Custom Amenity</Label>
                  <div className="flex gap-2">
                    <Input
                      value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                      placeholder="Add custom amenity..." 
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("amenities", amenityInput, setAmenityInput))}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => addArrayItem("amenities", amenityInput, setAmenityInput)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Selected amenities */}
                {formData.amenities.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Selected ({formData.amenities.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((item, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 pr-1">
                          {item}
                          <button type="button" onClick={() => removeArrayItem("amenities", i)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
                <CardDescription>Key selling points displayed prominently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g., Beachfront location, Award-winning spa"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("highlights", highlightInput, setHighlightInput))}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => addArrayItem("highlights", highlightInput, setHighlightInput)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.highlights.length > 0 ? (
                  <div className="space-y-2">
                    {formData.highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 group">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm flex-1">{item}</span>
                        <button type="button" onClick={() => removeArrayItem("highlights", i)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No highlights added yet</p>
                    <p className="text-xs">Add key features that make this hotel stand out</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === MEDIA === */}
        <TabsContent value="media" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Main Image</CardTitle>
                <CardDescription>Primary image shown in listings and cards</CardDescription>
              </CardHeader>
              <CardContent>
                <input type="file" ref={fileInputRef} onChange={handleMainImageUpload} accept="image/*" className="hidden" />
                {formData.image_url ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={formData.image_url} alt="Hotel" className="w-full h-56 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">Main Image</Badge>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm" onClick={() => fileInputRef.current?.click()}>
                          Replace
                        </Button>
                        <Button type="button" size="sm" variant="destructive" onClick={() => setFormData((p) => ({ ...p, image_url: "" }))}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploadingImage}
                    className="w-full h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Upload main image</p>
                          <p className="text-xs text-muted-foreground">Recommended: 1200×800px, JPG or WebP</p>
                        </div>
                      </>
                    )}
                  </button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery ({formData.gallery?.length || 0} images)</CardTitle>
                <CardDescription>Additional photos for the hotel detail page</CardDescription>
              </CardHeader>
              <CardContent>
                <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
                <div className="grid grid-cols-3 gap-3">
                  {formData.gallery?.map((url, i) => (
                    <div key={i} className="relative aspect-square group rounded-lg overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Button
                          type="button" variant="destructive" size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7"
                          onClick={() => removeGalleryImage(i)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button" onClick={() => galleryInputRef.current?.click()} disabled={isUploadingGallery}
                    className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {isUploadingGallery ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Add</span>
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === SEO === */}
        <TabsContent value="seo" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> SEO Settings</CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <CharacterCounter current={formData.meta_title.length} max={60} />
                  </div>
                  <Input
                    id="meta_title" value={formData.meta_title}
                    onChange={(e) => setFormData((p) => ({ ...p, meta_title: e.target.value }))}
                    placeholder="SEO page title (auto-generated if empty)"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <CharacterCounter current={formData.meta_description.length} max={160} />
                  </div>
                  <Textarea
                    id="meta_description" value={formData.meta_description}
                    onChange={(e) => setFormData((p) => ({ ...p, meta_description: e.target.value }))}
                    placeholder="SEO page description..." rows={3}
                  />
                </div>

                {!formData.meta_title && formData.name && (
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    setFormData((p) => ({
                      ...p,
                      meta_title: `${p.name} - ${p.category || "Hotel"} in ${p.location || "Dubai"}`,
                      meta_description: p.description?.replace(/<[^>]*>/g, "").slice(0, 155) || "",
                    }));
                    toast.success("SEO fields auto-generated");
                  }}>
                    <Star className="w-4 h-4 mr-2" /> Auto-generate from content
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5" /> Search Preview</CardTitle>
                <CardDescription>How this hotel appears in Google results</CardDescription>
              </CardHeader>
              <CardContent>
                <SEOPreview
                  title={formData.meta_title || formData.name || "Hotel Name"}
                  description={formData.meta_description || formData.description?.replace(/<[^>]*>/g, "") || "Hotel description"}
                  slug={formData.slug || "hotel-slug"}
                  baseUrl="rentalyachtindubai.com"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default HotelForm;
