import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import rentalYachtLogo from "@/assets/rental-yacht-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_CACHE_KEY, ADMIN_USER_KEY } from "@/components/admin/AdminLayout";
import { useContactConfig } from "@/hooks/useContactConfig";

const Footer = () => {
  const [isAdmin, setIsAdmin] = useState(false);
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

    // Check cache first for instant display
    const checkCache = () => {
      try {
        const userId = sessionStorage.getItem(ADMIN_USER_KEY);
        const verified = sessionStorage.getItem(ADMIN_CACHE_KEY);
        if (userId && verified === "true") {
          setIsAdmin(true);
          return true;
        }
      } catch {
        // Ignore storage errors
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
          // Check cache first
          if (!checkCache()) {
            // Defer database call
            setTimeout(() => {
              checkAdminStatus(session.user.id);
            }, 0);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Initial check
    const init = async () => {
      // Try cache first
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

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-10 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src={rentalYachtLogo} 
                alt="Rental Yacht Dubai" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl text-secondary leading-tight">Rental Yacht</span>
                <span className="text-[10px] sm:text-xs text-primary-foreground/70 tracking-wider uppercase">Dubai</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-xs sm:text-sm leading-relaxed">
              Experience the magic of Dubai with our premium yacht charters and dhow cruise experiences. 
              Creating unforgettable memories on the waters of Dubai Marina.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors touch-target">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors touch-target">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors touch-target">
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors touch-target">
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Our Tours
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Book Now
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Tours */}
          <div className="hidden sm:block">
            <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">Our Tours</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/tours/dhow-cruise-marina" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Dhow Cruise Marina
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Upper Deck Experience
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Private Charter
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 inline-block touch-target">
                  Sunset Cruise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold text-secondary mb-4 sm:mb-6">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-2 sm:gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 touch-target">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                  <span>{phoneFormatted}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2 sm:gap-3 text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm py-1 touch-target">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 sm:gap-3 text-primary-foreground/80 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 sm:py-6 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-primary-foreground/60 text-xs sm:text-sm text-center md:text-left">
            © 2024 Rental Yacht Dubai. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors py-1 touch-target">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors py-1 touch-target">
              Terms of Service
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors py-1 touch-target">
              Cancellation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
