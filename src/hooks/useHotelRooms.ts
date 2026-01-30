import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HotelRoom {
  id: string;
  hotel_id: string;
  name: string;
  description: string | null;
  max_guests: number;
  beds: string;
  size_sqm: number | null;
  price_per_night: number;
  amenities: string[];
  image_url: string | null;
  gallery: string[];
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HotelRoomFormData {
  hotel_id: string;
  name: string;
  description: string | null;
  max_guests: number;
  beds: string;
  size_sqm: number | null;
  price_per_night: number;
  amenities: string[];
  image_url: string | null;
  gallery: string[];
  is_available: boolean;
  sort_order: number;
}

export const useHotelRooms = (hotelId: string) => {
  return useQuery({
    queryKey: ["hotel-rooms", hotelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_rooms")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("is_available", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as HotelRoom[];
    },
    enabled: !!hotelId,
  });
};

export const useAdminHotelRooms = (hotelId: string) => {
  return useQuery({
    queryKey: ["admin-hotel-rooms", hotelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotel_rooms")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as HotelRoom[];
    },
    enabled: !!hotelId,
  });
};

export const useCreateHotelRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: HotelRoomFormData) => {
      const { data: result, error } = await supabase
        .from("hotel_rooms")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotel-rooms", variables.hotel_id] });
      queryClient.invalidateQueries({ queryKey: ["hotel-rooms", variables.hotel_id] });
      toast.success("Room added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateHotelRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HotelRoomFormData> }) => {
      const { data: result, error } = await supabase
        .from("hotel_rooms")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotel-rooms", result.hotel_id] });
      queryClient.invalidateQueries({ queryKey: ["hotel-rooms", result.hotel_id] });
      toast.success("Room updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteHotelRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("hotel_rooms")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return hotelId;
    },
    onSuccess: (hotelId) => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotel-rooms", hotelId] });
      queryClient.invalidateQueries({ queryKey: ["hotel-rooms", hotelId] });
      toast.success("Room deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
