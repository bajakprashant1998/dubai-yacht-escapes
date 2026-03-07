import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Star, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeatherRecommendations } from "@/hooks/useWeatherRecommendations";

const weatherIcons: Record<string, typeof Sun> = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  drizzle: CloudRain,
  showers: CloudRain,
  thunderstorm: CloudRain,
  foggy: Cloud,
  snow: Cloud,
  snow_showers: Cloud,
  unknown: Sun,
};

const WeatherRecommendations = memo(() => {
  const { data, isLoading, error } = useWeatherRecommendations();

  if (error || (!isLoading && !data)) return null;

  const WeatherIcon = data ? (weatherIcons[data.weather.condition] || Sun) : Sun;
  const isOutdoor = data?.recommendationType === "outdoor";

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-3xl -translate-y-1/2 ${
          isOutdoor ? "bg-secondary/5" : "bg-primary/5"
        }`} />
      </div>

      <div className="container relative">
        {/* Header with live weather */}
        <motion.div
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm px-4 py-1.5">
                🌤️ Weather-Smart Picks
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Today's Best Activities
              </h2>
              {isLoading ? (
                <Skeleton className="h-5 w-64 mt-2" />
              ) : (
                <p className="text-muted-foreground mt-2 text-lg">{data?.weatherTip}</p>
              )}
            </div>

            {/* Weather card */}
            {isLoading ? (
              <Skeleton className="h-24 w-64 rounded-2xl" />
            ) : data?.weather ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 shadow-sm min-w-[240px]"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{data.weather.icon}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{data.weather.description}</span>
                </div>
                <div className="border-l border-border pl-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-destructive" />
                    <span className="font-bold text-lg text-foreground">{data.weather.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> {data.weather.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3" /> {data.weather.wind_speed} km/h
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        {/* Recommendations grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {data?.recommendations.map((item, index) => (
              <Link
                key={item.id}
                to={item.type === "tour" ? `/tours/${item.slug}` : `/dubai/services/${item.slug}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer aspect-[4/5]"
                >
                  {/* Image */}
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`text-[10px] font-semibold ${
                      isOutdoor
                        ? "bg-emerald-500/90 text-white border-emerald-400/30"
                        : "bg-blue-500/90 text-white border-blue-400/30"
                    }`}>
                      {isOutdoor ? "☀️ Outdoor" : "🏢 Indoor"} Pick
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 mb-1.5">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-2 text-[11px] text-white/70">
                      {item.rating && (
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {item.rating}
                        </span>
                      )}
                      {item.duration && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {item.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {item.original_price && item.original_price > item.price && (
                          <span className="text-[10px] text-white/50 line-through">
                            AED {item.original_price}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-[11px] sm:text-xs font-semibold">
                          AED {item.price}
                        </span>
                      </div>
                      <span className="text-white/0 group-hover:text-white/80 transition-all duration-300 text-xs flex items-center gap-1">
                        Book <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

WeatherRecommendations.displayName = "WeatherRecommendations";
export default WeatherRecommendations;
