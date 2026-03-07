import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  icon: string;
  description: string;
}

interface WeatherRecommendation {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  price: number;
  original_price: number | null;
  rating: number | null;
  review_count: number | null;
  duration: string | null;
  type: "tour" | "service";
}

interface WeatherResponse {
  weather: WeatherData;
  recommendationType: "indoor" | "outdoor" | "mixed";
  weatherTip: string;
  recommendations: WeatherRecommendation[];
}

export const useWeatherRecommendations = () => {
  return useQuery<WeatherResponse>({
    queryKey: ["weather-recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("weather-recommendations");
      if (error) throw error;
      return data as WeatherResponse;
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
};
