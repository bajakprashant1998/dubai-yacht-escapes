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
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { useCreateVisaService, useUpdateVisaService, VisaService } from "@/hooks/useVisaServices";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import RichTextEditor from "./RichTextEditor";
import FAQEditor, { FAQItem } from "./FAQEditor";

interface VisaFormProps {
  visa?: VisaService;
  mode: "create" | "edit";
}

const visaTypes = ["Tourist", "Express", "Multiple Entry", "Transit", "Business", "Work"];

const VisaForm = ({ visa, mode }: VisaFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const createVisa = useCreateVisaService();
  const updateVisa = useUpdateVisaService();

  const [formData, setFormData] = useState({
    title: visa?.title || "",
    slug: visa?.slug || "",
    visa_type: visa?.visa_type || "Tourist",
    duration_days: visa?.duration_days?.toString() || "30",
    validity: visa?.validity || "",
    processing_time: visa?.processing_time || "2-3 business days",
    price: visa?.price?.toString() || "",
    original_price: visa?.original_price?.toString() || "",
    description: visa?.description || "",
    long_description: visa?.long_description || "",
    requirements: visa?.requirements || [],
    included: visa?.included || [],
    excluded: visa?.excluded || [],
    faqs: (visa?.faqs as FAQItem[]) || [],
    image_url: visa?.image_url || "",
    is_express: visa?.is_express || false,
    is_featured: visa?.is_featured || false,
    is_active: visa?.is_active ?? true,
    meta_title: visa?.meta_title || "",
    meta_description: visa?.meta_description || "",
  });

  const [requirementInput, setRequirementInput] = useState("");
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

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `main/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("visa-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("visa-images")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast.success("Image uploaded successfully");
    }
    setIsUploadingImage(false);
  };

  const addArrayItem = (
    field: "requirements" | "included" | "excluded",
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

  const removeArrayItem = (field: "requirements" | "included" | "excluded", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const visaData = {
      title: formData.title,
      slug: formData.slug,
      visa_type: formData.visa_type,
      duration_days: parseInt(formData.duration_days) || null,
      validity: formData.validity || null,
      processing_time: formData.processing_time || null,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      description: formData.description || null,
      long_description: formData.long_description || null,
      requirements: formData.requirements?.length ? formData.requirements : null,
      included: formData.included?.length ? formData.included : null,
      excluded: formData.excluded?.length ? formData.excluded : null,
      faqs: formData.faqs?.length ? formData.faqs : null,
      image_url: formData.image_url || null,
      is_express: formData.is_express,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      sort_order: visa?.sort_order || 0,
    };

    if (mode === "create") {
      createVisa.mutate(visaData, {
        onSuccess: () => navigate("/admin/visa-services"),
      });
    } else if (visa) {
      updateVisa.mutate({ id: visa.id, data: visaData }, {
        onSuccess: () => navigate("/admin/visa-services"),
      });
    }
  };

  const isSubmitting = createVisa.isPending || updateVisa.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Visa Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g., 30-Day Tourist Visa"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="30-day-tourist-visa"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Visa Type *</Label>
                  <Select
                    value={formData.visa_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, visa_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_days">Duration (Days)</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration_days: e.target.value }))}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validity">Validity</Label>
                  <Input
                    id="validity"
                    value={formData.validity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, validity: e.target.value }))}
                    placeholder="e.g., 60 days from issue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="processing_time">Processing Time</Label>
                <Input
                  id="processing_time"
                  value={formData.processing_time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, processing_time: e.target.value }))}
                  placeholder="e.g., 2-3 business days"
                />
              </div>

              <RichTextEditor
                id="description"
                label="Short Description"
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                placeholder="Brief visa description..."
                rows={3}
              />

              <RichTextEditor
                id="long_description"
                label="Full Description"
                value={formData.long_description}
                onChange={(value) => setFormData((prev) => ({ ...prev, long_description: value }))}
                placeholder="Detailed visa information..."
                rows={8}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing (AED)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
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
                  <Label htmlFor="original_price">Original Price (for discount)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements, Included, Excluded */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Inclusions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requirements */}
              <div className="space-y-3">
                <Label>Required Documents</Label>
                <div className="flex gap-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="e.g., Valid passport with 6 months validity"
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

              {/* Included */}
              <div className="space-y-3">
                <Label>What's Included</Label>
                <div className="flex gap-2">
                  <Input
                    value={includedInput}
                    onChange={(e) => setIncludedInput(e.target.value)}
                    placeholder="e.g., Visa processing fee"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("included", includedInput, setIncludedInput))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("included", includedInput, setIncludedInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.included?.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeArrayItem("included", i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excluded */}
              <div className="space-y-3">
                <Label>What's Not Included</Label>
                <div className="flex gap-2">
                  <Input
                    value={excludedInput}
                    onChange={(e) => setExcludedInput(e.target.value)}
                    placeholder="e.g., Travel insurance"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("excluded", excludedInput, setExcludedInput))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("excluded", excludedInput, setExcludedInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.excluded?.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                      {item}
                      <button type="button" onClick={() => removeArrayItem("excluded", i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              <FAQEditor
                items={formData.faqs}
                onChange={(faqs) => setFormData((prev) => ({ ...prev, faqs }))}
              />
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {formData.image_url ? (
                <div className="relative w-full h-48">
                  <img
                    src={formData.image_url}
                    alt="Visa"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="is_express">Express Processing</Label>
                <Switch
                  id="is_express"
                  checked={formData.is_express}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_express: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Visa Service" : "Update Visa Service"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/visa-services")}
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

export default VisaForm;
