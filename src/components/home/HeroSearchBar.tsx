import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTours } from "@/hooks/useTours";
import { useServices } from "@/hooks/useServices";
import { useCurrency } from "@/hooks/useCurrency";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  id: string;
  title: string;
  type: "tour" | "service";
  slug: string;
  price?: number;
  image?: string;
  duration?: string;
  location?: string;
  categoryName?: string;
}

const HeroSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();

  const { data: tours } = useTours();
  const { data: services } = useServices();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];

    const results: Suggestion[] = [];

    tours?.forEach((tour) => {
      if (tour.title.toLowerCase().includes(q) || tour.category?.toLowerCase().includes(q)) {
        results.push({
          id: tour.id,
          title: tour.title,
          type: "tour",
          slug: tour.slug || tour.id,
          price: tour.price,
          image: tour.image,
          duration: tour.duration,
          location: "Dubai",
          categoryName: tour.category?.replace(/-/g, " "),
        });
      }
    });

    services?.forEach((service) => {
      if (service.title.toLowerCase().includes(q) || service.categoryName?.toLowerCase().includes(q)) {
        results.push({
          id: service.id,
          title: service.title,
          type: "service",
          slug: service.slug || service.id,
          price: service.price,
          image: service.imageUrl,
          duration: service.duration || undefined,
          location: service.location || "Dubai",
          categoryName: service.categoryName,
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, tours, services]);

  // Extract unique category filter chips from results
  const filterChips = useMemo(() => {
    const cats = new Set<string>();
    suggestions.forEach((s) => {
      if (s.categoryName) cats.add(s.categoryName);
    });
    return Array.from(cats).slice(0, 4);
  }, [suggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsFocused(false);
      navigate(`/experiences?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (s: Suggestion) => {
    setIsFocused(false);
    setSearchQuery("");
    if (s.type === "tour") {
      navigate(`/dubai/tours/${s.slug}`);
    } else {
      navigate(`/dubai/services/${s.slug}`);
    }
  };

  const showDropdown = isFocused && searchQuery.length >= 2 && suggestions.length > 0;

  return (
    <div className="w-full max-w-2xl" ref={wrapperRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-foreground/10 backdrop-blur-md rounded-xl" />
          <div className="relative flex items-center gap-2 p-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
              <Input
                type="text"
                placeholder="Search tours, cruises, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full h-12 pl-12 pr-4 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-lg focus:bg-primary-foreground/20 focus:border-secondary transition-all"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold rounded-lg"
            >
              Search
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Filter chips */}
              {filterChips.length > 0 && (
                <div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap border-b border-border">
                  <span className="text-xs text-muted-foreground font-medium">Filter:</span>
                  {filterChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setSearchQuery(chip)}
                      className="px-3 py-1 text-xs font-medium bg-muted hover:bg-accent text-foreground rounded-full transition-colors capitalize"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Results list */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left group"
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{s.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {s.duration && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {s.duration}
                          </span>
                        )}
                        {s.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {s.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {s.price != null && (
                      <span className="text-sm font-bold text-secondary whitespace-nowrap shrink-0">
                        {formatPrice(s.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* See all */}
              <button
                type="button"
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-secondary hover:bg-accent/50 transition-colors border-t border-border"
              >
                <Search className="w-4 h-4" />
                See all results for "{searchQuery}"
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default HeroSearchBar;
