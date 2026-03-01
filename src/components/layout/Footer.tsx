import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube,
  Shield, Lock, ArrowRight, Sparkles, Clock, CheckCircle2, Headphones,
  Globe, Star, Heart, Anchor, Compass, Send, ExternalLink
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
    { icon: Shield, label: "Secure Booking", description: "256-bit SSL encrypted", color: "from-blue-500 to-indigo-600" },
    { icon: Clock, label: "24/7 Support", description: "Always here for you", color: "from-emerald-500 to-teal-600" },
    { icon: CheckCircle2, label: "Best Price", description: "Price match guarantee", color: "from-amber-500 to-orange-600" },
    { icon: Headphones, label: "Expert Guides", description: "Licensed local guides", color: "from-purple-500 to-violet-600" },
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
      {/* Background with premium depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-[hsl(var(--primary)/0.95)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-[10%] w-[600px] h-[600px] bg-secondary/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-40 left-[5%] w-[500px] h-[500px] bg-secondary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-[60%] right-[30%] w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'radial-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Trust Badges Strip - Enhanced */}
      <div className="relative border-b border-primary-foreground/[0.06]">
        <div className="container py-10 sm:py-12 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 sm:gap-4 group cursor-default"
              >
                <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${badge.color} p-[1.5px] flex-shrink-0`}>
                  <div className="w-full h-full rounded-2xl bg-primary/80 flex items-center justify-center group-hover:bg-primary/50 transition-all duration-500">
                    <badge.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {/* Glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                </div>
                <div className="min-w-0">
                  <p className="text-primary-foreground font-bold text-xs sm:text-sm leading-tight tracking-wide">{badge.label}</p>
                  <p className="text-primary-foreground/40 text-[10px] sm:text-xs mt-1 font-light">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container py-14 sm:py-20 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="inline-flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-2xl blur-xl group-hover:bg-secondary/30 transition-all duration-500" />
                  <img
                    src={betterviewLogo}
                    alt="Betterview Tourism"
                    className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-2xl sm:text-3xl text-secondary leading-tight tracking-tight">Betterview</span>
                  <span className="text-[10px] sm:text-xs text-primary-foreground/40 tracking-[0.25em] uppercase font-light mt-0.5">Tourism L.L.C</span>
                </div>
              </Link>
            </motion.div>
            
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-sm">
              Dubai's premier tourism company offering luxury yacht experiences, desert adventures, 
              theme parks, and unforgettable memories since 2015.
            </p>

            {/* Newsletter - Premium card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/[0.02] rounded-2xl blur-sm group-hover:from-secondary/15 transition-all duration-500" />
              <div className="relative bg-primary-foreground/[0.04] border border-primary-foreground/[0.08] rounded-2xl p-6 overflow-hidden backdrop-blur-sm group-hover:border-secondary/20 transition-all duration-500">
                {/* Corner accent */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/[0.06] rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary/[0.04] rounded-full blur-xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border border-secondary/10">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <span className="text-secondary font-bold text-sm">Exclusive Deals</span>
                      <p className="text-primary-foreground/35 text-[10px] leading-tight">Up to 40% off select experiences</p>
                    </div>
                  </div>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mt-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="h-12 bg-primary-foreground/[0.06] border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/25 flex-1 text-sm rounded-xl focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20"
                      disabled={subscribed}
                    />
                    <Button 
                      type="submit" 
                      className="h-12 px-5 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300"
                      disabled={subscribed}
                    >
                      {subscribed ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </form>
                  {subscribed && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-secondary text-xs mt-2 font-medium"
                    >
                      ✓ You're in! Check your inbox for deals.
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Social Links - Enhanced */}
            <div>
              <p className="text-primary-foreground/30 text-[10px] uppercase tracking-[0.2em] mb-4 font-medium">Connect with us</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary-foreground/[0.04] border border-primary-foreground/[0.08] flex items-center justify-center text-primary-foreground/50 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary hover:shadow-lg hover:shadow-secondary/20 transition-all duration-400 hover:scale-110 hover:-translate-y-1 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="font-display text-primary-foreground font-bold text-sm mb-5 sm:mb-6 flex items-center gap-2.5">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-secondary to-secondary/40" />
                  Quick Links
                </h4>
                <ul className="space-y-3 sm:space-y-3.5">
                  {quickLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-primary-foreground/45 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-300 inline-flex items-center gap-2 group hover:translate-x-1.5"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-secondary to-secondary/40 transition-all duration-300" />
                        <span className="group-hover:text-secondary/90 transition-colors">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="font-display text-primary-foreground font-bold text-sm mb-5 sm:mb-6 flex items-center gap-2.5">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-secondary to-secondary/40" />
                  Services
                </h4>
                <ul className="space-y-3 sm:space-y-3.5">
                  {services.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-primary-foreground/45 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-300 inline-flex items-center gap-2 group hover:translate-x-1.5"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-secondary to-secondary/40 transition-all duration-300" />
                        <span className="group-hover:text-secondary/90 transition-colors">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="text-primary-foreground/45 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-300 inline-flex items-center gap-2 group hover:translate-x-1.5"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-secondary to-secondary/40 transition-all duration-300" />
                        <span className="group-hover:text-secondary/90 transition-colors">Admin Panel</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </motion.div>

              {/* Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="font-display text-primary-foreground font-bold text-sm mb-5 sm:mb-6 flex items-center gap-2.5">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-secondary to-secondary/40" />
                  Activities
                </h4>
                <ul className="space-y-3 sm:space-y-3.5">
                  {activities.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-primary-foreground/45 hover:text-primary-foreground text-xs sm:text-sm transition-all duration-300 inline-flex items-center gap-2 group hover:translate-x-1.5"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-secondary to-secondary/40 transition-all duration-300" />
                        <span className="group-hover:text-secondary/90 transition-colors">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact - Enhanced cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="font-display text-primary-foreground font-bold text-sm mb-5 sm:mb-6 flex items-center gap-2.5">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-secondary to-secondary/40" />
                  Contact Us
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a 
                      href={`tel:${phone}`} 
                      className="flex items-start gap-3 text-primary-foreground/45 hover:text-primary-foreground transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-foreground/[0.08] to-primary-foreground/[0.02] border border-primary-foreground/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-secondary/30 group-hover:from-secondary/15 group-hover:to-secondary/5 transition-all duration-300 group-hover:shadow-md group-hover:shadow-secondary/10">
                        <Phone className="w-4 h-4 group-hover:text-secondary transition-colors" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] text-primary-foreground/30 mb-0.5 uppercase tracking-[0.15em] font-medium">Call us</p>
                        <p className="text-xs sm:text-sm font-semibold group-hover:text-secondary/90 transition-colors">{phoneFormatted}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a 
                      href={`mailto:${email}`} 
                      className="flex items-start gap-3 text-primary-foreground/45 hover:text-primary-foreground transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-foreground/[0.08] to-primary-foreground/[0.02] border border-primary-foreground/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-secondary/30 group-hover:from-secondary/15 group-hover:to-secondary/5 transition-all duration-300 group-hover:shadow-md group-hover:shadow-secondary/10">
                        <Mail className="w-4 h-4 group-hover:text-secondary transition-colors" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] text-primary-foreground/30 mb-0.5 uppercase tracking-[0.15em] font-medium">Email</p>
                        <p className="text-xs sm:text-sm font-semibold break-all group-hover:text-secondary/90 transition-colors">{email}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-start gap-3 text-primary-foreground/45">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-foreground/[0.08] to-primary-foreground/[0.02] border border-primary-foreground/[0.08] flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] text-primary-foreground/30 mb-0.5 uppercase tracking-[0.15em] font-medium">Address</p>
                        <p className="text-xs sm:text-sm leading-relaxed">{address}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Security Strip - Enhanced */}
      <div className="relative border-t border-primary-foreground/[0.06]">
        <div className="container py-6 sm:py-7 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <span className="text-primary-foreground/50 text-xs sm:text-sm font-medium">Secured by 256-bit SSL</span>
                <p className="text-primary-foreground/25 text-[10px]">Your data is always protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-5">
              <span className="text-primary-foreground/25 text-[10px] uppercase tracking-[0.2em] font-medium">We Accept</span>
              <div className="flex items-center gap-2">
                {["Visa", "Mastercard", "Amex", "Apple Pay"].map((method) => (
                  <div 
                    key={method} 
                    className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl bg-primary-foreground/[0.04] border border-primary-foreground/[0.08] flex items-center justify-center hover:border-secondary/20 hover:bg-primary-foreground/[0.06] transition-all duration-300"
                  >
                    <span className="text-primary-foreground/55 text-[10px] sm:text-xs font-semibold tracking-wide">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-primary-foreground/[0.06] bg-primary-foreground/[0.02]">
        <div className="container py-5 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/35 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Betterview Tourism L.L.C. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-5 sm:gap-7 text-xs sm:text-sm">
              <Link to="/privacy-policy" className="text-primary-foreground/35 hover:text-secondary transition-colors duration-300 font-medium">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-primary-foreground/35 hover:text-secondary transition-colors duration-300 font-medium">
                Terms of Service
              </Link>
              <Link to="/cancellation-policy" className="text-primary-foreground/35 hover:text-secondary transition-colors duration-300 font-medium">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Dibull Credit */}
        <div className="border-t border-primary-foreground/[0.04]">
          <div className="container py-3.5 px-4 sm:px-6">
            <p className="text-center text-primary-foreground/25 text-xs flex items-center justify-center gap-1.5">
              Crafted with <Heart className="w-3 h-3 text-secondary/50 fill-secondary/50" /> by{" "}
              <a
                href="https://www.dibull.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/40 hover:text-secondary transition-colors duration-300 font-semibold"
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
