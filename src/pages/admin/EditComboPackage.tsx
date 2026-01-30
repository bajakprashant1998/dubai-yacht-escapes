import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useComboPackage, useUpdateComboPackage, calculateComboPrice } from "@/hooks/useComboPackages";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().optional(),
  long_description: z.string().optional(),
  combo_type: z.enum(["essentials", "family", "couple", "adventure", "luxury"]),
  duration_days: z.coerce.number().min(1, "Minimum 1 day"),
  duration_nights: z.coerce.number().min(0, "Cannot be negative"),
  base_price_aed: z.coerce.number().min(0, "Cannot be negative"),
  discount_percent: z.coerce.number().min(0).max(100),
  includes_hotel: z.boolean().default(false),
  hotel_star_rating: z.coerce.number().min(1).max(5).optional().nullable(),
  includes_visa: z.boolean().default(false),
  includes_transport: z.boolean().default(false),
  transport_type: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  highlights: z.string().optional(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const EditComboPackage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: combo, isLoading } = useComboPackage(slug || "");
  const updateCombo = useUpdateComboPackage();
  const [finalPrice, setFinalPrice] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      long_description: "",
      combo_type: "essentials",
      duration_days: 3,
      duration_nights: 2,
      base_price_aed: 0,
      discount_percent: 0,
      includes_hotel: true,
      hotel_star_rating: 4,
      includes_visa: false,
      includes_transport: true,
      transport_type: "sedan",
      image_url: "",
      highlights: "",
      meta_title: "",
      meta_description: "",
      is_featured: false,
      is_active: true,
    },
  });

  // Populate form when combo data loads
  useEffect(() => {
    if (combo) {
      form.reset({
        name: combo.name,
        slug: combo.slug,
        description: combo.description || "",
        long_description: combo.long_description || "",
        combo_type: combo.combo_type as FormValues["combo_type"],
        duration_days: combo.duration_days,
        duration_nights: combo.duration_nights,
        base_price_aed: combo.base_price_aed,
        discount_percent: combo.discount_percent,
        includes_hotel: combo.includes_hotel,
        hotel_star_rating: combo.hotel_star_rating,
        includes_visa: combo.includes_visa,
        includes_transport: combo.includes_transport,
        transport_type: combo.transport_type,
        image_url: combo.image_url,
        highlights: combo.highlights?.join("\n") || "",
        meta_title: combo.meta_title,
        meta_description: combo.meta_description,
        is_featured: combo.is_featured,
        is_active: combo.is_active,
      });
      setFinalPrice(combo.final_price_aed);
    }
  }, [combo, form]);

  const watchBasePrice = form.watch("base_price_aed");
  const watchDiscount = form.watch("discount_percent");

  useEffect(() => {
    const { finalPrice: fp } = calculateComboPrice(watchBasePrice || 0, watchDiscount || 0);
    setFinalPrice(fp);
  }, [watchBasePrice, watchDiscount]);

  const onSubmit = (values: FormValues) => {
    if (!combo) return;

    const highlightsArray = values.highlights
      ? values.highlights.split("\n").filter((h) => h.trim())
      : [];

    const { finalPrice: fp } = calculateComboPrice(values.base_price_aed, values.discount_percent);

    updateCombo.mutate(
      {
        id: combo.id,
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        long_description: values.long_description || null,
        combo_type: values.combo_type,
        duration_days: values.duration_days,
        duration_nights: values.duration_nights,
        base_price_aed: values.base_price_aed,
        discount_percent: values.discount_percent,
        final_price_aed: fp,
        includes_hotel: values.includes_hotel,
        hotel_star_rating: values.includes_hotel ? values.hotel_star_rating : null,
        includes_visa: values.includes_visa,
        includes_transport: values.includes_transport,
        transport_type: values.includes_transport ? values.transport_type : null,
        image_url: values.image_url || null,
        highlights: highlightsArray,
        meta_title: values.meta_title || null,
        meta_description: values.meta_description || null,
        is_featured: values.is_featured,
        is_active: values.is_active,
      },
      {
        onSuccess: () => {
          navigate("/admin/combo-packages");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </AdminLayout>
    );
  }

  if (!combo) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">The combo package you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/admin/combo-packages")}>Back to Packages</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dubai Family Adventure" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="dubai-family-adventure" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL: /combo-packages/{field.value || "slug"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="combo_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="essentials">Essentials</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="couple">Romantic (Couple)</SelectItem>
                              <SelectItem value="adventure">Adventure</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="duration_days"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="duration_nights"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nights</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description for cards and listings..." 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="long_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description for the detail page..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="base_price_aed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price (AED)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormDescription>Total price before discount</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount %</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} max={100} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Final Price</p>
                    <p className="text-2xl font-bold text-foreground">
                      AED {finalPrice.toLocaleString()}
                    </p>
                    {watchDiscount > 0 && (
                      <p className="text-sm text-destructive">
                        Saving: AED {(watchBasePrice - finalPrice).toLocaleString()} ({watchDiscount}%)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Inclusions */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Inclusions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Hotel Included</Label>
                      <p className="text-sm text-muted-foreground">Include hotel accommodation</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="includes_hotel"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>

                  {form.watch("includes_hotel") && (
                    <FormField
                      control={form.control}
                      name="hotel_star_rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hotel Star Rating</FormLabel>
                          <Select 
                            onValueChange={(val) => field.onChange(parseInt(val))} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="3">3-Star</SelectItem>
                              <SelectItem value="4">4-Star</SelectItem>
                              <SelectItem value="5">5-Star</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Transport Included</Label>
                      <p className="text-sm text-muted-foreground">Include private transport</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="includes_transport"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>

                  {form.watch("includes_transport") && (
                    <FormField
                      control={form.control}
                      name="transport_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transport Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedan">Sedan</SelectItem>
                              <SelectItem value="suv">SUV</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Visa Included</Label>
                      <p className="text-sm text-muted-foreground">Include UAE tourist visa</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="includes_visa"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Highlights & Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Highlights & Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Highlights</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter one highlight per line..."
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>One highlight per line</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="SEO page title" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="SEO description for search engines..."
                            rows={2}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                    <div>
                      <Label>Active</Label>
                      <p className="text-xs text-muted-foreground">Visible on website</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Featured</Label>
                      <p className="text-xs text-muted-foreground">Show on homepage</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/admin/combo-packages")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={updateCombo.isPending}>
                  {updateCombo.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default EditComboPackage;
