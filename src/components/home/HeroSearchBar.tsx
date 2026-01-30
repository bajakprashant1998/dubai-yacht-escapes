import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sun, FerrisWheel, Waves, MapPin, Mountain, Ship } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const popularCategories = [
  { name: "Desert Safari", slug: "desert-safari", icon: Sun },
  { name: "Theme Parks", slug: "theme-parks", icon: FerrisWheel },
  { name: "Water Sports", slug: "water-sports", icon: Waves },
  { name: "City Tours", slug: "city-tours", icon: MapPin },
  { name: "Adventure", slug: "adventure-sports", icon: Mountain },
  { name: "Cruises", slug: "sightseeing-cruises", icon: Ship },
];

const HeroSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/dubai/services/${slug}`);
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-4">
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
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
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
