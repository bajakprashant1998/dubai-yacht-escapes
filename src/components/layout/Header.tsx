import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, ChevronDown, Ship, Sparkles, Sun, FerrisWheel, Waves, MapPin, Search, ArrowRight, Car, Building, FileText, Star, MessageCircle } from "lucide-react";
import betterviewLogo from "@/assets/betterview-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContactConfig } from "@/hooks/useContactConfig";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationBell from "@/components/NotificationBell";
import CurrencySelector from "@/components/trip/CurrencySelector";
import { useI18n } from "@/lib/i18n";

type DropdownType = "activities" | "services" | null;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const location = useLocation();
  const { phone, phoneFormatted, email } = useContactConfig();
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.plan_trip"), path: "/plan-trip", highlight: true },
    { name: "Activities", path: "/experiences", dropdown: "activities" as DropdownType },
    { name: t("nav.services"), path: "/services", dropdown: "services" as DropdownType },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const activityCategories = [
    { name: "Dhow Cruises", path: "/dubai/services/sightseeing-cruises", icon: Ship, description: "Traditional wooden vessel dining with live entertainment", image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=300&q=80", badge: "Popular" },
    { name: "Shared Yacht Tours", path: "/tours", icon: Ship, description: "Affordable luxury with live BBQ & swimming", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=80" },
    { name: "Private Charters", path: "/tours?category=yacht-private", icon: Ship, description: "Exclusive yacht experience for your group", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=300&q=80", badge: "Premium" },
    { name: "Desert Safari", path: "/dubai/services/desert-safari", icon: Sun, description: "Thrilling desert adventures with BBQ dinner", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=300&q=80" },
    { name: "Water Activities", path: "/dubai/services/water-sports", icon: Waves, description: "Jet ski, parasailing & water sports", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=80", badge: "New" },
    { name: "City Tours", path: "/dubai/services/city-tours", icon: MapPin, description: "Explore Dubai's landmarks and hidden gems", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&q=80" },
  ];

  const serviceCategories = [
    { name: "Combo Packages", path: "/combo-packages", icon: Sparkles, description: "Bundled tour packages" },
    { name: "Car Rentals", path: "/car-rentals", icon: Car, description: "Luxury & economy vehicles" },
    { name: "Hotels", path: "/hotels", icon: Building, description: "Premium accommodations" },
    { name: "Visa Services", path: "/visa-services", icon: FileText, description: "UAE visa assistance" },
  ];

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
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden card-elevated">
          {/* Hero banner */}
          <div className="bg-gradient-to-r from-primary via-primary to-primary/90 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-primary-foreground font-display font-bold text-lg mb-1">
                Explore Dubai by Sea
              </h3>
              <p className="text-primary-foreground/70 text-sm italic max-w-xs">
                Premium yacht cruises, dhow dinners & water adventures curated for unforgettable moments
              </p>
            </div>
            <Link
              to="/tours"
              className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-secondary/20"
            >
              View All Tours
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category cards grid */}
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {activityCategories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="group block"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-2.5">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                    {/* Icon overlay */}
                    <div className="absolute bottom-2 left-2 w-7 h-7 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <category.icon className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    {/* Badge */}
                    {category.badge && (
                      <span className={cn(
                        "absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md",
                        category.badge === "Popular" && "bg-secondary text-secondary-foreground",
                        category.badge === "Premium" && "bg-primary text-primary-foreground",
                        category.badge === "New" && "bg-destructive text-destructive-foreground"
                      )}>
                        {category.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors">
                      {category.name}
                    </h4>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom trust strip */}
          <div className="border-t border-border/40 px-5 py-3 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                <strong className="text-foreground">4.9</strong> from 500+ reviews
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                Dubai Marina & Palm
              </span>
            </div>
            <Link
              to="/contact"
              className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
            >
              Need Help?
              <MessageCircle className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      );
    }

    if (type === "services") {
      return (
        <div className="bg-card rounded-xl shadow-2xl border border-border/50 overflow-hidden p-5 w-[320px] card-elevated">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Our Services
          </p>
          <div className="space-y-1">
            {serviceCategories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors border border-secondary/10">
                  <category.icon className="w-4.5 h-4.5 text-secondary" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors block">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{category.description}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-lg shadow-lg"
          : "bg-background/95 backdrop-blur-md"
      } border-b border-border`}
    >
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
            <span className="flex items-center gap-1 text-secondary">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.dropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200",
                      isActive(link.path)
                        ? "text-secondary bg-secondary/10"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.name}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        activeDropdown === link.dropdown && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === link.dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "absolute top-full pt-3",
                          link.dropdown === "activities"
                            ? "left-1/2 -translate-x-1/2 w-[720px]"
                            : "left-0"
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
                    "text-sm font-medium transition-all duration-200 px-4 py-2.5 rounded-xl",
                    link.highlight
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : isActive(link.path)
                      ? "text-secondary bg-secondary/10"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Right Side Actions */}
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
                      className="h-9 pr-9 rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
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
                    className="text-foreground/70 hover:text-foreground hover:bg-muted rounded-xl h-9 w-9"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </AnimatePresence>
            </div>

            <CurrencySelector compact />
            <LanguageSwitcher />
            <NotificationBell />

            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center h-9 w-9 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              title={phoneFormatted}
            >
              <Phone className="w-4 h-4" />
            </a>

            <Link to="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-5 h-9 rounded-xl text-sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
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
                {/* Search */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 pl-11 text-sm rounded-xl bg-muted/50 border-0 focus-visible:ring-1"
                    />
                  </div>
                </form>

                {/* Nav Links */}
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
                          <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg font-medium">
                            AI
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Categories */}
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
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <category.icon className="w-4 h-4 text-secondary" />
                          </div>
                          <span className="text-xs font-medium text-foreground/80 leading-tight">
                            {category.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Currency & Language */}
                <div className="border-t border-border/50 pt-4 mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
                    Preferences
                  </p>
                  <div className="flex items-center gap-3 px-1">
                    <CurrencySelector compact />
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto pt-4 space-y-3 pb-safe">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{phoneFormatted}</p>
                      <p className="text-xs text-muted-foreground">Tap to call</p>
                    </div>
                  </a>

                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-12 text-sm rounded-xl">
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
