import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Shield, 
  Lock, 
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Headphones
} from "lucide-react";
import betterviewLogo from "@/assets/betterview-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { getAdminCache } from "@/lib/adminAuth";
import { useContactConfig } from "@/hooks/useContactConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const { phone, phoneFormatted, email, address } = useContactConfig();

  useEffect(() => {
    let cancelled = false;

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .limit(1);

        if (!cancelled) {
          setIsAdmin(Array.isArray(data) ? data.length > 0 : !!data);
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    };

    const checkCache = () => {
      const cache = getAdminCache();
      if (cache) {
        setIsAdmin(true);
        return true;
      }
      return false;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return;

        if (event === "SIGNED_OUT") {
          setIsAdmin(false);
          return;
        }

        if (session?.user) {
          if (!checkCache()) {
            setTimeout(() => {
              checkAdminStatus(session.user.id);
            }, 0);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    const init = async () => {
      if (checkCache()) return;

      const { data } = await supabase.auth.getSession();
      if (data.session?.user && !cancelled) {
        checkAdminStatus(data.session.user.id);
      }
    };

    init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    try {
      await supabase.from("newsletter_subscribers").insert({
        email: emailInput.trim(),
        source: "footer"
      });
      setEmailInput("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  const trustBadges = [
    { icon: Shield, label: "Secure Booking", description: "256-bit SSL" },
    { icon: Clock, label: "24/7 Support", description: "Always available" },
    { icon: CheckCircle2, label: "Best Price", description: "Guaranteed" },
    { icon: Headphones, label: "Expert Team", description: "Local guides" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Plan Trip", path: "/plan-trip" },
    { name: "Combo Packages", path: "/combo-packages" },
    { name: "Activities", path: "/experiences" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Car Rentals", path: "/car-rentals" },
    { name: "Hotels", path: "/hotels" },
    { name: "Visa Services", path: "/visa-services" },
    { name: "Gallery", path: "/gallery" },
    { name: "FAQ", path: "/faq" },
    { name: "Travel Tips", path: "/travel-tips" },
  ];

  const activities = [
    { name: "Desert Safari", path: "/dubai/services/desert-safari" },
    { name: "Theme Parks", path: "/dubai/services/theme-parks" },
    { name: "Sightseeing Cruises", path: "/dubai/services/sightseeing-cruises" },
    { name: "Water Sports", path: "/dubai/services/water-sports" },
    { name: "City Tours", path: "/dubai/services/city-tours" },
    { name: "Adventure Sports", path: "/dubai/services/adventure-sports" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/betterviewtourism", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/betterviewtourism", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/betterviewuae", label: "Twitter" },
    { icon: Youtube, href: "https://www.youtube.com/@betterviewtourism", label: "YouTube" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary/95" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-secondary/5 rounded-full blur-2xl" />

      {/* Trust Badges Strip */}
      <div className="relative border-b border-primary-foreground/10">
        <div className="container py-8 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold text-sm sm:text-base">{badge.label}</p>
                  <p className="text-primary-foreground/60 text-xs sm:text-sm">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container py-12 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand & Newsletter - Takes 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src={betterviewLogo}
                alt="Betterview Tourism"
                className="w-14 h-14 object-contain rounded-xl transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl text-secondary leading-tight">Betterview</span>
                <span className="text-xs text-primary-foreground/60 tracking-widest uppercase">Tourism L.L.C</span>
              </div>
            </Link>
            
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              Dubai's premier tourism company offering luxury experiences, desert adventures, 
              theme parks, and unforgettable memories since 2015.
            </p>

            {/* Newsletter */}
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-secondary font-semibold text-sm">Get Exclusive Deals</span>
              </div>
              <p className="text-primary-foreground/60 text-xs mb-4">
                Subscribe for special offers and travel tips
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-11 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 flex-1"
                />
                <Button type="submit" className="h-11 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid - Takes 8 columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-display text-secondary font-semibold text-sm uppercase tracking-wider mb-5">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display text-secondary font-semibold text-sm uppercase tracking-wider mb-5">
                Services
              </h4>
              <ul className="space-y-3">
                {services.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all duration-200" />
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Activities */}
            <div>
              <h4 className="font-display text-secondary font-semibold text-sm uppercase tracking-wider mb-5">
                Activities
              </h4>
              <ul className="space-y-3">
                {activities.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-secondary font-semibold text-sm uppercase tracking-wider mb-5">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href={`tel:${phone}`} 
                    className="flex items-start gap-3 text-primary-foreground/70 hover:text-secondary transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/50 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/50 mb-0.5">Call us</p>
                      <p className="text-sm font-medium">{phoneFormatted}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href={`mailto:${email}`} 
                    className="flex items-start gap-3 text-primary-foreground/70 hover:text-secondary transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/50 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/50 mb-0.5">Email</p>
                      <p className="text-sm font-medium break-all">{email}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-primary-foreground/70">
                    <div className="w-9 h-9 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-foreground/50 mb-0.5">Address</p>
                      <p className="text-sm">{address}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Security Strip */}
      <div className="relative border-t border-primary-foreground/10">
        <div className="container py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground/60 text-sm">Secured by 256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/40 text-xs uppercase tracking-wider">We Accept</span>
              <div className="flex items-center gap-2">
                {["Visa", "Mastercard", "Amex", "Apple Pay"].map((method) => (
                  <div 
                    key={method} 
                    className="h-8 px-3 rounded-md bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center"
                  >
                    <span className="text-primary-foreground/70 text-xs font-medium">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-primary-foreground/10 bg-primary-foreground/5">
        <div className="container py-5 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Betterview Tourism L.L.C. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy-policy" className="text-primary-foreground/50 hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-primary-foreground/50 hover:text-secondary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cancellation-policy" className="text-primary-foreground/50 hover:text-secondary transition-colors">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Dibull Credit */}
        <div className="border-t border-primary-foreground/10">
          <div className="container py-3 px-4 sm:px-6">
            <p className="text-center text-primary-foreground/40 text-xs">
              Crafted with ♥ by{" "}
              <a
                href="https://www.dibull.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                Dibull
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;