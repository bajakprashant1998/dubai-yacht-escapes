import { Tables } from "@/integrations/supabase/types";

export type ServiceRow = Tables<"services">;
export type ServiceCategoryRow = Tables<"service_categories">;

export interface ItineraryItem {
  time: string;
  activity: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  longDescription: string | null;
  price: number;
  originalPrice: number | null;
  duration: string | null;
  imageUrl: string;
  imageAlt: string | null;
  gallery: string[];
  categoryId: string | null;
  categoryName?: string;
  categorySlug?: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  meetingPoint: string | null;
  location: string | null;
  itinerary: ItineraryItem[];
  faqs: FAQItem[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  bookingType: "per_person" | "per_group" | "per_vehicle";
  minParticipants: number;
  maxParticipants: number | null;
  cancellationPolicy: string | null;
  instantConfirmation: boolean;
  hotelPickup: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  serviceCount?: number;
}

const DEFAULT_SERVICE_IMAGE = "/placeholder.svg";

export function mapServiceFromRow(row: ServiceRow, category?: ServiceCategoryRow | null): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    longDescription: row.long_description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    duration: row.duration,
    imageUrl: row.image_url || DEFAULT_SERVICE_IMAGE,
    imageAlt: (row as any).image_alt || null,
    gallery: row.gallery || [],
    categoryId: row.category_id,
    categoryName: category?.name,
    categorySlug: category?.slug,
    highlights: row.highlights || [],
    included: row.included || [],
    excluded: row.excluded || [],
    meetingPoint: row.meeting_point,
    location: (row as any).location || null,
    itinerary: ((row as any).itinerary as ItineraryItem[]) || [],
    faqs: ((row as any).faqs as FAQItem[]) || [],
    rating: Number(row.rating) || 4.5,
    reviewCount: row.review_count || 0,
    isFeatured: row.is_featured || false,
    isActive: row.is_active || false,
    bookingType: (row.booking_type as Service["bookingType"]) || "per_person",
    minParticipants: row.min_participants || 1,
    maxParticipants: row.max_participants,
    cancellationPolicy: row.cancellation_policy,
    instantConfirmation: row.instant_confirmation ?? true,
    hotelPickup: row.hotel_pickup ?? false,
    sortOrder: row.sort_order || 0,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaKeywords: row.meta_keywords || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapServiceCategoryFromRow(row: ServiceCategoryRow): ServiceCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon || "folder",
    imageUrl: row.image_url,
    isActive: row.is_active ?? true,
    sortOrder: row.sort_order || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
