import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Ship,
  Sparkles,
  Sun,
  FerrisWheel,
  Waves,
  MapPin,
  Search,
  ArrowRight,
  Car,
  Building,
  FileText
} from "lucide-react";
import betterviewLogo from "@/assets/betterview-logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContactConfig } from "@/hooks/useContactConfig";
import { cn } from "@/lib/utils";

type DropdownType = "activities" | "services" | null;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const location = useLocation();
  const { phone, phoneFormatted, email } = useContactConfig();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Plan Trip", path: "/plan-trip", highlight: true },
    { name: "Activities", path: "/experiences", dropdown: "activities" as DropdownType },
    { name: "Services", path: "/services", dropdown: "services" as DropdownType },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const activityCategories = [
    {
      name: "Desert Safari",
      path: "/dubai/services/desert-safari",
      icon: Sun,
      description: "Thrilling desert adventures with BBQ dinner",
      image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=200&q=80"
    },
    {
      name: "Theme Parks",
      path: "/dubai/services/theme-parks",
      icon: FerrisWheel,
      description: "World-class theme parks and attractions",
      image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=200&q=80"
    },
    {
      name: "Water Sports",
      path: "/dubai/services/water-sports",
      icon: Waves,
      description: "Exciting water activities and adventures",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&q=80"
    },
    {
      name: "City Tours",
      path: "/dubai/services/city-tours",
      icon: MapPin,
      description: "Explore Dubai's landmarks and hidden gems",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=80"
    },
    {
      name: "Sightseeing Cruises",
      path: "/dubai/services/sightseeing-cruises",
      icon: Ship,
      description: "Dhow cruises, yacht tours & marina experiences",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=200&q=80"
    },
    {
      name: "Adventure Sports",
      path: "/dubai/services/adventure-sports",
      icon: Sparkles,
      description: "Skydiving, hot air balloons & more",
      image: "https://images.unsplash.com/photo-1521673461164-de300ebcfb17?w=200&q=80"
    },
  ];

  const serviceCategories = [
    { name: "Combo Packages", path: "/combo-packages", icon: Sparkles, description: "Bundled tour packages" },
    { name: "Car Rentals", path: "/car-rentals", icon: Car, description: "Luxury & economy vehicles" },
    { name: "Hotels", path: "/hotels", icon: Building, description: "Premium accommodations" },
    { name: "Visa Services", path: "/visa-services", icon: FileText, description: "UAE visa assistance" },
  ];

  const featuredActivities = activityCategories.slice(0, 3);

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/experiences?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const renderDropdown = (type: DropdownType) => {
    if (type === "activities") {
      return (
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-3 gap-0">
            <div className="col-span-2 p-6 border-r border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Browse Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {activityCategories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors shrink-0">
                      <category.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-secondary transition-colors text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-6 bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Featured
              </p>
              <div className="space-y-3">
                {featuredActivities.map((activity) => (
                  <Link
                    key={activity.path}
                    to={activity.path}
                    className="block group"
                  >
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">
                      {activity.name}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                to="/experiences"
                className="flex items-center gap-2 text-sm font-semibold text-secondary mt-4 hover:underline"
              >
                View All Activities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (type === "services") {
      return (
        <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden p-5 w-[320px]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Our Services
          </p>
          <div className="space-y-1">
            {serviceCategories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <category.icon className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <span className="font-medium text-sm text-foreground group-hover:text-secondary transition-colors block">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{category.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? "bg-background/98 backdrop-blur-lg shadow-lg"
      : "bg-background/95 backdrop-blur-md"
      } border-b border-border`}>
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              {phoneFormatted}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              {email}
            </a>
          </div>
          <div className="flex items-center gap-4 text-secondary font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Instant Confirmation
            </span>
            <span>•</span>
            <span>Best Price Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.img
              src={betterviewLogo}
              alt="Betterview Tourism"
              className={cn(
                "object-contain rounded-lg transition-all duration-300",
                isScrolled ? "h-10 w-auto" : "h-12 w-auto"
              )}
            />
          </Link>

          {/* Desktop Navigation - Clean & Simple */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.dropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full transition-all duration-200",
                      isActive(link.path) 
                        ? "text-secondary bg-secondary/10" 
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200", 
                      activeDropdown === link.dropdown && "rotate-180"
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === link.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute top-full pt-3",
                          link.dropdown === "activities" ? "left-1/2 -translate-x-1/2 w-[700px]" : "left-0"
                        )}
                      >
                        {renderDropdown(link.dropdown)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-all duration-200 px-4 py-2.5 rounded-full',
                    link.highlight
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                      : isActive(link.path)
                        ? 'text-secondary bg-secondary/10'
                        : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Side Actions - Minimal */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pr-9 rounded-full bg-muted/50 border-0 focus-visible:ring-1"
                      autoFocus
                      onBlur={() => {
                        if (!searchQuery) setIsSearchOpen(false);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.form>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="text-foreground/70 hover:text-foreground hover:bg-muted rounded-full h-9 w-9"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </AnimatePresence>
            </div>

            {/* Phone - Simple icon */}
            <a 
              href={`tel:${phone}`} 
              className="flex items-center justify-center h-9 w-9 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              title={phoneFormatted}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* CTA - Clean button */}
            <Link to="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5 h-9 rounded-full text-sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Clean & Modern */}
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-[72px] bg-background z-[60] overflow-y-auto"
            >
              <div className="container py-6 flex flex-col min-h-full">
                {/* Search Bar - Minimal */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 pl-11 text-sm rounded-full bg-muted/50 border-0 focus-visible:ring-1"
                    />
                  </div>
                </form>

                {/* Nav Links - Simple List */}
                <div className="space-y-1 mb-8">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          "flex items-center justify-between text-base font-medium py-3.5 px-4 rounded-xl transition-colors",
                          isActive(link.path)
                            ? "text-secondary bg-secondary/10"
                            : "text-foreground/80 hover:text-foreground hover:bg-muted"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                        {link.highlight && (
                          <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                            AI
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Categories - Compact Grid */}
                <div className="border-t border-border/50 pt-6 mb-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-4">
                    Quick Access
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {activityCategories.slice(0, 6).map((category, index) => (
                      <motion.div
                        key={category.path}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + index * 0.03 }}
                      >
                        <Link
                          to={category.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors text-center"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <category.icon className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="text-xs font-medium text-foreground/80 leading-tight">{category.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions - Clean */}
                <div className="mt-auto pt-4 space-y-3 pb-safe">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{phoneFormatted}</p>
                      <p className="text-xs text-muted-foreground">Tap to call</p>
                    </div>
                  </a>

                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-12 text-sm rounded-full">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};

export default Header;
