import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sun, FerrisWheel, Waves, MapPin, Mountain, Ship, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTours } from "@/hooks/useTours";
import { useServices } from "@/hooks/useServices";
import { motion, AnimatePresence } from "framer-motion";

const popularCategories = [
  { name: "Desert Safari", slug: "desert-safari", icon: Sun },
  { name: "Theme Parks", slug: "theme-parks", icon: FerrisWheel },
  { name: "Water Sports", slug: "water-sports", icon: Waves },
  { name: "City Tours", slug: "city-tours", icon: MapPin },
  { name: "Adventure", slug: "adventure-sports", icon: Mountain },
  { name: "Cruises", slug: "sightseeing-cruises", icon: Ship },
];

const trendingSearches = [
  "Desert Safari",
  "Yacht Tour",
  "Burj Khalifa",
  "Dubai Marina Cruise",
  "Theme Parks",
];

interface Suggestion {
  id: string;
  title: string;
  type: "tour" | "service";
  slug: string;
  price?: number;
  image?: string;
}

const HeroSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: tours } = useTours();
  const { data: services } = useServices();

  // Close on outside click
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
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, tours, services]);

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

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/dubai/services/${slug}`);
  };

  const showDropdown = isFocused && (searchQuery.length < 2 || suggestions.length > 0);

  return (
    <div className="w-full max-w-2xl" ref={wrapperRef}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-4 relative">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-foreground/10 backdrop-blur-md rounded-xl" />
          <div className="relative flex items-center gap-2 p-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
              <Input
                type="text"
                placeholder="What do you want to do in Dubai?"
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

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              {searchQuery.length >= 2 && suggestions.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Results
                  </p>
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors text-left group"
                    >
                      {s.image ? (
                        <img
                          src={s.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{s.type}</p>
                      </div>
                      {s.price && (
                        <span className="text-sm font-semibold text-secondary shrink-0">
                          AED {s.price}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:bg-accent/50 transition-colors border-t border-border mt-1"
                  >
                    <Search className="w-4 h-4" />
                    See all results for "{searchQuery}"
                  </button>
                </div>
              ) : (
                <div className="py-3 px-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleTrendingClick(term)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted hover:bg-accent text-foreground rounded-full transition-colors"
                      >
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-primary-foreground/60 text-sm font-medium mr-1 self-center">Popular:</span>
        {popularCategories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/20 hover:border-secondary/50 text-primary-foreground text-sm rounded-full transition-all duration-200 hover:scale-105 group"
          >
            <category.icon className="w-3.5 h-3.5 text-secondary group-hover:scale-110 transition-transform" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSearchBar;
