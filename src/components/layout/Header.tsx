import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  ArrowRight
} from "lucide-react";
import betterviewLogo from "@/assets/betterview-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContactConfig } from "@/hooks/useContactConfig";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMegaMenu, setShowMegaMenu] = useState(false);
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
    setShowMegaMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Plan Trip", path: "/plan-trip", highlight: true },
    { name: "Combo Packages", path: "/combo-packages" },
    { name: "Activities", path: "/experiences", hasDropdown: true },
    { name: "Car Rentals", path: "/car-rentals" },
    { name: "Hotels", path: "/hotels" },
    { name: "Visa", path: "/visa-services" },
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

  const featuredActivities = activityCategories.slice(0, 3);

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/experiences?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
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
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Instant Confirmation
            </span>
            <span>•</span>
            <span>Best Price Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.img 
              src={betterviewLogo} 
              alt="Betterview Tourism" 
              className={cn(
                "object-contain rounded-lg transition-all duration-300",
                isScrolled ? "h-12 w-auto" : "h-14 w-auto"
              )}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div 
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setShowMegaMenu(true)}
                  onMouseLeave={() => setShowMegaMenu(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-all",
                      isActive(link.path) ? "text-secondary bg-secondary/10" : "text-foreground hover:text-secondary hover:bg-muted/50"
                    )}
                  >
                    {link.name}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showMegaMenu && "rotate-180")} />
                  </button>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {showMegaMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px]"
                      >
                        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                          <div className="grid grid-cols-3 gap-0">
                            {/* Categories List */}
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

                            {/* Featured */}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-all px-4 py-2 rounded-lg',
                    link.highlight 
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md'
                      : 'hover:bg-muted/50',
                    isActive(link.path) && !link.highlight
                      ? 'text-secondary bg-secondary/10' 
                      : link.highlight ? '' : 'text-foreground hover:text-secondary'
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSearch}
                    className="overflow-hidden"
                  >
                    <Input
                      type="search"
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 pr-10"
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
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                )}
              </AnimatePresence>
            </div>

            {/* Phone */}
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{phoneFormatted}</span>
            </a>

            {/* CTA */}
            <Link to="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Full Screen Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-[65px] bg-background z-50 overflow-y-auto"
            >
              <div className="container py-6 flex flex-col min-h-full">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search activities, tours..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 pl-12 text-base"
                    />
                  </div>
                </form>

                {/* Nav Links */}
                <div className="space-y-1 mb-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          "flex items-center justify-between text-lg font-medium py-4 px-4 rounded-xl transition-colors",
                          isActive(link.path) 
                            ? "text-secondary bg-secondary/10" 
                            : "text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                        {link.highlight && (
                          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                            AI Powered
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Mobile Activity Categories */}
                <div className="border-t border-border pt-6 mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-4">
                    Popular Activities
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {activityCategories.map((category, index) => (
                      <motion.div
                        key={category.path}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <Link 
                          to={category.path} 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <category.icon className="w-5 h-5 text-secondary" />
                          </div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto border-t border-border pt-6 space-y-4 pb-safe">
                  <a 
                    href={`tel:${phone}`} 
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground px-4 py-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Call Us</p>
                      <p className="text-sm">{phoneFormatted}</p>
                    </div>
                  </a>
                  
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-14 text-base">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
