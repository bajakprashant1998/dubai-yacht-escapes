import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube,
  Shield, Lock, ArrowRight, Sparkles, Clock, CheckCircle2, Headphones,
  Globe, Star, Heart
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
  const [subscribed, setSubscribed] = useState(false);
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
      if (cache) { setIsAdmin(true); return true; }
      return false;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return;
        if (event === "SIGNED_OUT") { setIsAdmin(false); return; }
        if (session?.user) {
          if (!checkCache()) setTimeout(() => checkAdminStatus(session.user.id), 0);
        } else { setIsAdmin(false); }
      }
    );

    const init = async () => {
      if (checkCache()) return;
      const { data } = await supabase.auth.getSession();
      if (data.session?.user && !cancelled) checkAdminStatus(data.session.user.id);
    };
    init();

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    try {
      await supabase.from("newsletter_subscribers").insert({ email: emailInput.trim(), source: "footer" });
      setEmailInput("");
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  const trustBadges = [
    { icon: Shield, label: "Secure Booking", description: "256-bit SSL", color: "from-blue-500 to-indigo-600" },
    { icon: Clock, label: "24/7 Support", description: "Always available", color: "from-emerald-500 to-teal-600" },
    { icon: CheckCircle2, label: "Best Price", description: "Guaranteed", color: "from-amber-500 to-orange-600" },
    { icon: Headphones, label: "Expert Team", description: "Local guides", color: "from-purple-500 to-violet-600" },
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary/98" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-40 left-[5%] w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[100px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Trust Badges Strip */}
      <div className="relative border-b border-primary-foreground/8">
        <div className="container py-8 sm:py-10 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 sm:gap-4 group cursor-default"
              >
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${badge.color} p-[1px] flex-shrink-0`}>
                  <div className="w-full h-full rounded-xl sm:rounded-2xl bg-primary/80 flex items-center justify-center group-hover:bg-primary/60 transition-colors">
                    <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-primary-foreground font-semibold text-xs sm:text-sm leading-tight">{badge.label}</p>
                  <p className="text-primary-foreground/50 text-[10px] sm:text-xs mt-0.5">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container py-12 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 rounded-xl sm:rounded-2xl blur-lg group-hover:bg-secondary/30 transition-colors" />
                <img
                  src={betterviewLogo}
                  alt="Betterview Tourism"
                  className="relative w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-xl sm:rounded-2xl transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl sm:text-3xl text-secondary leading-tight">Betterview</span>
                <span className="text-xs sm:text-sm text-primary-foreground/50 tracking-[0.2em] uppercase">Tourism L.L.C</span>
              </div>
            </Link>
            
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm">
              Dubai's premier tourism company offering luxury experiences, desert adventures, 
              theme parks, and unforgettable memories since 2015.
            </p>

            {/* Newsletter */}
            <div className="relative bg-gradient-to-br from-primary-foreground/5 to-primary-foreground/[0.02] border border-primary-foreground/10 rounded-2xl p-5 sm:p-6 overflow-hidden">
              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="text-secondary font-semibold text-sm">Get Exclusive Deals</span>
                </div>
                <p className="text-primary-foreground/50 text-xs mb-4">
                  Subscribe for special offers and travel tips
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="h-11 bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 flex-1 text-sm rounded-xl focus:border-secondary/50"
                    disabled={subscribed}
                  />
                  <Button 
                    type="submit" 
                    className="h-11 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl shadow-lg shadow-secondary/10"
                    disabled={subscribed}
                  >
                    {subscribed ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-primary-foreground/40 text-xs uppercase tracking-wider mb-3">Follow us</p>
              <div className="flex gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {/* Quick Links */}
              <div>
                <h4 className="font-display text-primary-foreground font-semibold text-sm mb-4 sm:mb-5 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-secondary" />
                  Quick Links
                </h4>
                <ul className="space-y-2.5 sm:space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-primary-foreground/55 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-200 inline-flex items-center gap-1.5 group hover:translate-x-1"
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
                <h4 className="font-display text-primary-foreground font-semibold text-sm mb-4 sm:mb-5 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-secondary" />
                  Services
                </h4>
                <ul className="space-y-2.5 sm:space-y-3">
                  {services.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-primary-foreground/55 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-200 inline-flex items-center gap-1.5 group hover:translate-x-1"
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
                        className="text-primary-foreground/55 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-200 inline-flex items-center gap-1.5 group hover:translate-x-1"
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
                <h4 className="font-display text-primary-foreground font-semibold text-sm mb-4 sm:mb-5 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-secondary" />
                  Activities
                </h4>
                <ul className="space-y-2.5 sm:space-y-3">
                  {activities.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-primary-foreground/55 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-200 inline-flex items-center gap-1.5 group hover:translate-x-1"
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
                <h4 className="font-display text-primary-foreground font-semibold text-sm mb-4 sm:mb-5 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-secondary" />
                  Contact Us
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a 
                      href={`tel:${phone}`} 
                      className="flex items-start gap-3 text-primary-foreground/55 hover:text-primary-foreground transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/40 group-hover:from-secondary/10 group-hover:to-secondary/5 transition-all">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-primary-foreground/40 mb-0.5 uppercase tracking-wider">Call us</p>
                        <p className="text-xs sm:text-sm font-medium">{phoneFormatted}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href={`mailto:${email}`} 
                      className="flex items-start gap-3 text-primary-foreground/55 hover:text-primary-foreground transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/40 group-hover:from-secondary/10 group-hover:to-secondary/5 transition-all">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-primary-foreground/40 mb-0.5 uppercase tracking-wider">Email</p>
                        <p className="text-xs sm:text-sm font-medium break-all">{email}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-start gap-3 text-primary-foreground/55">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-primary-foreground/40 mb-0.5 uppercase tracking-wider">Address</p>
                        <p className="text-xs sm:text-sm leading-relaxed">{address}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Security Strip */}
      <div className="relative border-t border-primary-foreground/8">
        <div className="container py-5 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-secondary" />
              </div>
              <span className="text-primary-foreground/50 text-xs sm:text-sm">Secured by 256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-primary-foreground/35 text-[10px] sm:text-xs uppercase tracking-wider">We Accept</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {["Visa", "Mastercard", "Amex", "Apple Pay"].map((method) => (
                  <div 
                    key={method} 
                    className="h-7 sm:h-8 px-3 sm:px-3.5 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:border-primary-foreground/20 transition-colors"
                  >
                    <span className="text-primary-foreground/60 text-[10px] sm:text-xs font-medium">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-primary-foreground/8 bg-primary-foreground/[0.03]">
        <div className="container py-4 sm:py-5 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-primary-foreground/40 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Betterview Tourism L.L.C. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link to="/privacy-policy" className="text-primary-foreground/40 hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-primary-foreground/40 hover:text-secondary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cancellation-policy" className="text-primary-foreground/40 hover:text-secondary transition-colors">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Dibull Credit */}
        <div className="border-t border-primary-foreground/5">
          <div className="container py-3 px-4 sm:px-6">
            <p className="text-center text-primary-foreground/30 text-xs flex items-center justify-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-secondary/60 fill-secondary/60" /> by{" "}
              <a
                href="https://www.dibull.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/50 hover:text-secondary transition-colors font-medium"
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
