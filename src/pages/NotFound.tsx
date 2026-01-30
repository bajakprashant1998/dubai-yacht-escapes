import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Search, Home, Compass, Ship, Car, Hotel, Plane, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import betterviewLogo from "@/assets/betterview-logo.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/experiences?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularLinks = [
    { icon: Compass, label: "Desert Safari", href: "/dubai/services/desert-safari" },
    { icon: Ship, label: "Yacht Tours", href: "/dubai/services/sightseeing-cruises" },
    { icon: Car, label: "Car Rentals", href: "/car-rentals" },
    { icon: Hotel, label: "Hotels", href: "/hotels" },
    { icon: Plane, label: "Visa Services", href: "/visa-services" },
    { icon: MapPin, label: "All Activities", href: "/experiences" },
  ];

  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Explore our Dubai tours, yacht charters, and experiences."
        noIndex
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/90 flex flex-col">
        {/* Header */}
        <div className="container py-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src={betterviewLogo}
              alt="Betterview Tourism"
              className="w-10 h-10 object-contain rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-secondary leading-tight group-hover:text-secondary/80 transition-colors">
                Betterview
              </span>
              <span className="text-[10px] text-primary-foreground/70 tracking-wider uppercase">
                Tourism
              </span>
            </div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* 404 Animation */}
            <div className="relative mb-8">
              <h1 className="text-[150px] sm:text-[200px] font-display font-bold text-primary-foreground/10 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
                  <Ship className="w-16 h-16 text-secondary animate-bounce" />
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Oops! This page has sailed away
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on course!
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-full bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0 focus-visible:ring-secondary"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Popular Links */}
            <div className="mb-10">
              <p className="text-primary-foreground/60 text-sm mb-4 uppercase tracking-wider">
                Popular Destinations
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {popularLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/10 hover:border-secondary/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                      <link.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-primary-foreground font-medium text-sm">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
              >
                <Link to="/">
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="container py-6 text-center">
          <p className="text-primary-foreground/50 text-sm">
            Need help?{" "}
            <Link to="/contact" className="text-secondary hover:text-secondary/80 transition-colors">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
