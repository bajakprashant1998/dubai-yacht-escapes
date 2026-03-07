import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  icon: string;
  description: string;
}

// Dubai coordinates
const DUBAI_LAT = 25.2048;
const DUBAI_LON = 55.2708;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch weather from Open-Meteo (free, no API key needed)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${DUBAI_LAT}&longitude=${DUBAI_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia/Dubai`;

    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Weather API failed");
    const weatherJson = await weatherRes.json();

    const current = weatherJson.current;
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    const weatherCode = current.weather_code;

    // Map WMO weather codes to conditions
    const { condition, icon, description } = mapWeatherCode(weatherCode);

    const weather: WeatherData = {
      temperature: Math.round(temp),
      condition,
      humidity,
      wind_speed: Math.round(windSpeed),
      icon,
      description,
    };

    // Determine recommendation type based on weather
    const isHot = temp > 38;
    const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
    const isWindy = windSpeed > 30;
    const isPleasant = temp >= 20 && temp <= 35 && !isRainy && !isWindy;

    // Fetch relevant tours and services from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let recommendationType: string;
    let weatherTip: string;

    if (isRainy) {
      recommendationType = "indoor";
      weatherTip = "Rainy day in Dubai! Perfect for indoor attractions and mall experiences.";
    } else if (isHot) {
      recommendationType = "indoor";
      weatherTip = `It's ${weather.temperature}°C — stay cool with indoor activities or water experiences!`;
    } else if (isWindy) {
      recommendationType = "indoor";
      weatherTip = "Windy conditions today. We recommend sheltered activities.";
    } else if (isPleasant) {
      recommendationType = "outdoor";
      weatherTip = `Beautiful ${weather.temperature}°C weather! Ideal for outdoor adventures and desert safaris.`;
    } else {
      recommendationType = "mixed";
      weatherTip = `${weather.temperature}°C today — great for both indoor and outdoor activities!`;
    }

    // Indoor categories/keywords
    const indoorKeywords = ["theme park", "museum", "aquarium", "mall", "observation", "indoor", "spa", "dining"];
    const outdoorKeywords = ["desert", "safari", "yacht", "cruise", "water sport", "beach", "garden", "outdoor", "jet ski", "kayak"];

    // Fetch tours
    const { data: tours } = await supabase
      .from("tours")
      .select("id, title, slug, image_url, price, original_price, rating, review_count, duration, category_id")
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .limit(50);

    // Fetch services
    const { data: services } = await supabase
      .from("services")
      .select("id, title, slug, image_url, price, original_price, rating, review_count, duration")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .limit(50);

    // Score and filter recommendations
    const allItems = [
      ...(tours || []).map((t) => ({ ...t, type: "tour" as const })),
      ...(services || []).map((s) => ({ ...s, type: "service" as const })),
    ];

    const scored = allItems.map((item) => {
      const titleLower = item.title.toLowerCase();
      let score = 0;

      if (recommendationType === "indoor") {
        if (indoorKeywords.some((k) => titleLower.includes(k))) score += 10;
        if (outdoorKeywords.some((k) => titleLower.includes(k))) score -= 5;
        // Water activities are good when it's hot
        if (isHot && titleLower.match(/water|pool|aqua|swim/)) score += 8;
      } else if (recommendationType === "outdoor") {
        if (outdoorKeywords.some((k) => titleLower.includes(k))) score += 10;
        if (indoorKeywords.some((k) => titleLower.includes(k))) score -= 3;
      } else {
        score += 5; // mixed - everything gets a baseline
      }

      // Boost by rating
      score += (item.rating || 4) * 1.5;
      // Boost featured/popular
      if (item.review_count && item.review_count > 50) score += 3;

      return { ...item, score };
    });

    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ score, ...item }) => item);

    return new Response(
      JSON.stringify({
        weather,
        recommendationType,
        weatherTip,
        recommendations,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Weather recommendation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function mapWeatherCode(code: number): { condition: string; icon: string; description: string } {
  if (code === 0) return { condition: "clear", icon: "☀️", description: "Clear sky" };
  if (code <= 3) return { condition: "cloudy", icon: "⛅", description: "Partly cloudy" };
  if (code <= 48) return { condition: "foggy", icon: "🌫️", description: "Foggy" };
  if (code <= 57) return { condition: "drizzle", icon: "🌦️", description: "Light drizzle" };
  if (code <= 67) return { condition: "rain", icon: "🌧️", description: "Rain" };
  if (code <= 77) return { condition: "snow", icon: "🌨️", description: "Snow" };
  if (code <= 82) return { condition: "showers", icon: "🌧️", description: "Rain showers" };
  if (code <= 86) return { condition: "snow_showers", icon: "🌨️", description: "Snow showers" };
  if (code >= 95) return { condition: "thunderstorm", icon: "⛈️", description: "Thunderstorm" };
  return { condition: "unknown", icon: "🌤️", description: "Mixed conditions" };
}
