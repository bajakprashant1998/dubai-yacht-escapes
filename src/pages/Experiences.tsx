import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  FerrisWheel,
  Building2,
  Waves,
  MapPin,
  Car,
  UtensilsCrossed,
  Mountain,
  ArrowRight,
  Shield,
  Clock,
  BadgeCheck,
  Phone,
  Landmark,
  Flower2,
  Fish,
  Droplets,
  Ship,
  Ticket,
  Search,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Heart,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Compass,
  Zap,
  Award,
  Globe,
  CalendarDays,
  X,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServices } from "@/hooks/useServices";
import { useContactConfig } from "@/hooks/useContactConfig";
import SEOHead from "@/components/SEOHead";

const experienceCategories = [
  { name: "Desert Safari", slug: "desert-safari", icon: Sun, emoji: "🏜️", description: "Thrilling desert adventures with dune bashing, camel rides, and BBQ dinner under the stars", image: "/assets/services/desert-safari.jpg", tag: "Most Popular" },
  { name: "Theme Parks", slug: "theme-parks", icon: FerrisWheel, emoji: "🎢", description: "World-class theme parks including Dubai Parks, IMG Worlds, and Ski Dubai", image: "/assets/services/theme-parks.jpg", tag: "Family Favorite" },
  { name: "Observation Decks", slug: "observation-decks", icon: Building2, emoji: "🏙️", description: "Breathtaking views from Burj Khalifa, Dubai Frame, Ain Dubai, and Aura Skypool", image: "/assets/services/observation-decks.jpg", tag: "Iconic" },
  { name: "Water Sports", slug: "water-sports", icon: Waves, emoji: "🏄", description: "Exciting water activities including jet skiing, flyboarding, parasailing, and scuba diving", image: "/assets/services/water-sports.jpg", tag: "Adventure" },
  { name: "Museums & Attractions", slug: "museums-attractions", icon: Landmark, emoji: "🏛️", description: "Museum of the Future, AYA Universe, Madame Tussauds, and immersive experiences", image: "/assets/services/museums-attractions.jpg", tag: "" },
  { name: "Zoos & Aquariums", slug: "zoos-aquariums", icon: Fish, emoji: "🐠", description: "Dubai Aquarium, The Green Planet, Lost Chambers, and wildlife encounters", image: "/assets/services/zoos-aquariums.jpg", tag: "Kids Love" },
  { name: "Water Parks", slug: "water-parks", icon: Droplets, emoji: "💦", description: "Aquaventure Atlantis, Wild Wadi, Laguna Waterpark, and splash-filled adventures", image: "/assets/services/water-parks.jpg", tag: "" },
  { name: "Parks & Gardens", slug: "parks-gardens", icon: Flower2, emoji: "🌺", description: "Dubai Miracle Garden, Butterfly Garden, Safari Park, and natural escapes", image: "/assets/services/parks-gardens.jpg", tag: "Seasonal" },
  { name: "City Tours", slug: "city-tours", icon: MapPin, emoji: "📍", description: "Explore Dubai's landmarks, heritage sites, and hidden gems with expert guides", image: "/assets/services/city-tours.jpg", tag: "" },
  { name: "Sightseeing Cruises", slug: "sightseeing-cruises", icon: Ship, emoji: "🚢", description: "Dhow cruises, yacht tours, speed boats, and scenic marina experiences", image: "/assets/services/sightseeing-cruises.jpg", tag: "Best Seller" },
  { name: "Adventure Sports", slug: "adventure-sports", icon: Mountain, emoji: "🪂", description: "Skydiving, hot air balloons, ziplines, helicopter tours, and dune buggies", image: "/assets/services/adventure-sports.jpg", tag: "Thrill Seekers" },
  { name: "Dining Experiences", slug: "dining-experiences", icon: UtensilsCrossed, emoji: "🍽️", description: "At.mosphere Burj Khalifa, Burj Al Arab High Tea, and unforgettable culinary journeys", image: "/assets/services/dining-experiences.jpg", tag: "Luxury" },
  { name: "Airport Transfers", slug: "airport-transfers", icon: Car, emoji: "🚗", description: "Comfortable and reliable airport pickup and drop-off services", image: "/assets/services/airport-transfers.jpg", tag: "" },
  { name: "Attraction Passes", slug: "attraction-passes", icon: Ticket, emoji: "🎫", description: "Multi-attraction combo passes for maximum savings and flexibility", image: "/assets/services/attraction-passes.jpg", tag: "Save More" },
];

const heroStats = [
  { value: "200+", label: "Activities", icon: Compass },
  { value: "50K+", label: "Happy Guests", icon: Users },
  { value: "4.8", label: "Avg Rating", icon: Star },
  { value: "14", label: "Categories", icon: Grid3X3 },
];

const whyChooseUs = [
  { icon: Zap, title: "Instant Confirmation", description: "Book now, get confirmed in seconds" },
  { icon: Shield, title: "Best Price Guarantee", description: "We match any competitor's price" },
  { icon: Clock, title: "24/7 Support", description: "Round-the-clock customer service" },
  { icon: Award, title: "Verified Reviews", description: "Trusted by 50,000+ travelers" },
  { icon: Globe, title: "Multi-Language Guides", description: "Available in 10+ languages" },
  { icon: CalendarDays, title: "Flexible Scheduling", description: "Free cancellation up to 24hrs" },
];

type ViewMode = "grid" | "list";
type SortMode = "popular" | "trending" | "new" | "deals";

const Experiences = () => {
  const { phone, phoneFormatted } = useContactConfig();
  const { data: services, isLoading } = useServices();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("popular");

  const featuredServices = useMemo(
    () => services?.filter((s) => s.isFeatured)?.slice(0, 8) || [],
    [services]
  );

  const serviceCounts = useMemo(() => {
    if (!services) return new Map<string, number>();
    const map = new Map<string, number>();
    services.forEach((s) => {
      const slug = s.categorySlug;
      if (slug) map.set(slug, (map.get(slug) || 0) + 1);
    });
    return map;
  }, [services]);

  const filteredCategories = useMemo(() => {
    let cats = experienceCategories;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cats = cats.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "all") {
      cats = cats.filter((c) => c.slug === activeCategory);
    }
    return cats;
  }, [searchQuery, activeCategory]);

  const sortedFeatured = useMemo(() => {
    let list = [...featuredServices];
    switch (sortMode) {
      case "trending":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        list.sort((a, b) => b.sortOrder - a.sortOrder);
        break;
      case "deals":
        list = list.filter((s) => s.originalPrice && s.originalPrice > s.price);
        break;
      default:
        break;
    }
    return list;
  }, [featuredServices, sortMode]);

  const totalServices = services?.length || 0;

  return (
    <Layout>
      <SEOHead
        title="Dubai Activities & Experiences | 200+ Things to Do"
        description="Explore Dubai's best activities: desert safaris, theme parks, yacht tours, water sports, and more. Book unforgettable experiences with Betterview Tourism."
        canonical="/experiences"
        keywords={["Dubai activities", "Dubai experiences", "desert safari", "theme parks Dubai", "water sports Dubai", "Dubai tours"]}
      />

      {/* ── Hero Section ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/85" />
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url('/assets/services/city-tours.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-secondary/5"
              style={{ left: `${15 + i * 18}%`, top: `${10 + i * 12}%` }}
              animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="container relative z-10 text-center py-20 px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-6 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-1.5" />
              {totalServices > 0 ? `${totalServices}+ Activities Available` : "Explore Dubai"}
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Discover Dubai's Best
              <br />
              <span className="text-secondary">Activities & Experiences</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              From thrilling desert adventures to luxury dining — explore the best of Dubai with our curated collection.
            </p>

            {/* Hero Search */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search experiences... e.g. desert safari, yacht tour"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-2xl text-base bg-background/95 backdrop-blur-sm border-0 shadow-xl focus-visible:ring-secondary"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {experienceCategories.filter(c => c.tag).slice(0, 5).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setActiveCategory(cat.slug); document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="px-4 py-2 rounded-full bg-primary-foreground/10 hover:bg-secondary/30 text-primary-foreground text-sm font-medium backdrop-blur-sm transition-all border border-primary-foreground/10 hover:border-secondary/40"
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 rounded-xl h-13" asChild>
                <a href="#categories"><ArrowRight className="mr-2 w-5 h-5" />Browse All Experiences</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 rounded-xl h-13" asChild>
                <Link to="/plan-trip"><Compass className="mr-2 w-5 h-5" />Plan My Trip</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/10">
                <stat.icon className="w-5 h-5 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-xs text-primary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Category Filter Bar ── */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>
            {experienceCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? "all" : cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.name}
                {serviceCounts.get(cat.slug) ? (
                  <span className="text-[10px] opacity-70">({serviceCounts.get(cat.slug)})</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section id="categories" className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Explore by Category
              </h2>
              <p className="text-muted-foreground">
                {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} available
                {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("grid")}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredCategories.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-6">Try a different search term or clear your filters.</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>Clear Filters</Button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/dubai/services/${category.slug}`}>
                      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 h-full border-0 shadow-md">
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                          {category.tag && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold shadow-lg">
                                {category.tag}
                              </Badge>
                            </div>
                          )}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2.5 text-primary-foreground">
                              <div className="w-11 h-11 rounded-xl bg-secondary/20 backdrop-blur-md flex items-center justify-center border border-primary-foreground/10">
                                <span className="text-xl">{category.emoji}</span>
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-lg leading-tight">{category.name}</h3>
                                {serviceCounts.get(category.slug) ? (
                                  <p className="text-[11px] text-primary-foreground/70">{serviceCounts.get(category.slug)} activities</p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                          <div className="mt-3 flex items-center text-secondary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            Explore Activities <ChevronRight className="ml-0.5 w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                  >
                    <Link to={`/dubai/services/${category.slug}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-56 h-40 sm:h-auto shrink-0 overflow-hidden">
                            <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                            {category.tag && (
                              <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-[10px] font-bold">{category.tag}</Badge>
                            )}
                          </div>
                          <CardContent className="flex-1 p-5 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{category.emoji}</span>
                              <h3 className="font-display font-bold text-xl text-foreground group-hover:text-secondary transition-colors">{category.name}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                            <div className="flex items-center justify-between">
                              {serviceCounts.get(category.slug) ? (
                                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{serviceCounts.get(category.slug)} activities</span>
                              ) : <span />}
                              <span className="text-secondary font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                                View All <ArrowRight className="ml-1 w-4 h-4" />
                              </span>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Featured Activities with Tabs ── */}
      {featuredServices.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  Handpicked for You
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Featured Activities
                </h2>
              </div>
              <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="popular" className="text-xs sm:text-sm">🔥 Popular</TabsTrigger>
                  <TabsTrigger value="trending" className="text-xs sm:text-sm">📈 Top Rated</TabsTrigger>
                  <TabsTrigger value="new" className="text-xs sm:text-sm">✨ New</TabsTrigger>
                  <TabsTrigger value="deals" className="text-xs sm:text-sm">💰 Deals</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={sortMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {sortedFeatured.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedFeatured.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                      >
                        <Link to={`/dubai/services/${service.categorySlug || "general"}/${service.slug}`}>
                          <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 h-full border-0 shadow-md">
                            <div className="relative h-52 overflow-hidden">
                              <img
                                src={service.imageUrl || "/placeholder.svg"}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                              {service.originalPrice && service.originalPrice > service.price && (
                                <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold shadow-lg">
                                  {Math.round((1 - service.price / service.originalPrice) * 100)}% OFF
                                </Badge>
                              )}
                              {service.instantConfirmation && (
                                <Badge className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] backdrop-blur-sm">
                                  <Zap className="w-3 h-3 mr-0.5" />
                                  Instant
                                </Badge>
                              )}
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-primary-foreground text-xs bg-foreground/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                                  {service.rating}
                                  {service.reviewCount > 0 && <span className="opacity-70">({service.reviewCount})</span>}
                                </div>
                                {service.duration && (
                                  <span className="text-primary-foreground text-xs bg-foreground/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {service.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                            <CardContent className="p-4">
                              {service.categoryName && (
                                <p className="text-[11px] text-secondary font-semibold uppercase tracking-wider mb-1">{service.categoryName}</p>
                              )}
                              <h3 className="font-display font-bold text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
                                {service.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                              <div className="mt-3 flex items-center justify-between pt-3 border-t border-border">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-xs text-muted-foreground">From</span>
                                  <span className="text-lg font-bold text-secondary">AED {service.price}</span>
                                  {service.originalPrice && service.originalPrice > service.price && (
                                    <span className="text-xs text-muted-foreground line-through">AED {service.originalPrice}</span>
                                  )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No activities found for this filter. Try another tab!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="rounded-xl px-8">
                <Link to="/services">
                  View All Activities
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Book With Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trusted by thousands of travelers for the best Dubai experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="bg-background rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/assets/services/desert-safari.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-6">
                  <Heart className="w-3.5 h-3.5 mr-1" />
                  Personalized Experience
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                  Not Sure What to Choose?
                </h2>
                <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
                  Let our AI trip planner create a customized Dubai itinerary based on your preferences, budget, and travel dates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 rounded-xl h-13" asChild>
                    <Link to="/plan-trip">
                      <Sparkles className="mr-2 w-5 h-5" />
                      Plan My Trip with AI
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 rounded-xl h-13" asChild>
                    <a href={`tel:${phone}`}>
                      <Phone className="mr-2 w-5 h-5" />
                      {phoneFormatted}
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Experiences;
