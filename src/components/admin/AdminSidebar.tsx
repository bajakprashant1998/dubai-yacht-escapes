import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Ship,
  MessageSquare,
  Star,
  Image,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  Percent,
  History,
  Scale,
  Headset,
  Sparkles,
  HelpCircle,
  LogOut,
  Shield,
  Car,
  Building,
  FileText,
  BookOpen,
  Plane,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clearAdminCache } from "@/lib/adminAuth";
import betterviewLogo from "@/assets/betterview-logo.png";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "AI Trip Planner", href: "/admin/ai-trips", icon: Plane },
  { title: "Bookings", href: "/admin/bookings", icon: Calendar },
  { title: "Live Chat", href: "/admin/live-chat", icon: Headset },
  { title: "Locations", href: "/admin/locations", icon: MapPin },
  {
    title: "Tours",
    icon: Ship,
    children: [
      { title: "All Tours", href: "/admin/tours" },
      { title: "Add Tour", href: "/admin/tours/add" },
      { title: "Categories", href: "/admin/tours/categories" },
    ],
  },
  {
    title: "Activities",
    icon: Sparkles,
    children: [
      { title: "All Activities", href: "/admin/services" },
      { title: "Add Activity", href: "/admin/services/add" },
      { title: "Categories", href: "/admin/services/categories" },
    ],
  },
  { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Gallery", href: "/admin/gallery", icon: Image },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Discounts", href: "/admin/discounts", icon: Percent },
  { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { title: "Activity Log", href: "/admin/activity-log", icon: History },
  {
    title: "Car Rentals",
    icon: Car,
    children: [
      { title: "All Cars", href: "/admin/car-rentals" },
      { title: "Add Car", href: "/admin/car-rentals/add" },
      { title: "Categories", href: "/admin/car-rentals/categories" },
    ],
  },
  {
    title: "Hotels",
    icon: Building,
    children: [
      { title: "All Hotels", href: "/admin/hotels" },
      { title: "Add Hotel", href: "/admin/hotels/add" },
    ],
  },
  {
    title: "Visa Services",
    icon: FileText,
    children: [
      { title: "All Visas", href: "/admin/visa-services" },
      { title: "Add Visa", href: "/admin/visa-services/add" },
    ],
  },
  {
    title: "Blog",
    icon: BookOpen,
    children: [
      { title: "All Posts", href: "/admin/blog" },
      { title: "Add Post", href: "/admin/blog/add" },
      { title: "Categories", href: "/admin/blog/categories" },
    ],
  },
  { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "User Roles", href: "/admin/roles", icon: Shield },
  { title: "Legal Pages", href: "/admin/legal-pages", icon: Scale },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Site Settings", href: "/admin/settings/site" },
      { title: "Homepage", href: "/admin/settings/homepage" },
      { title: "Footer", href: "/admin/settings/footer" },
      { title: "Email Templates", href: "/admin/settings/email" },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Tours", "Settings", "Activities", "Car Rentals", "Hotels", "Visa Services", "Blog"]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
  }, []);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    clearAdminCache();
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some((child) => location.pathname === child.href);

  const getInitials = (email: string | null) => {
    if (!email) return "AD";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-primary text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-3 p-6 border-b border-white/10">
          <img 
            src={betterviewLogo} 
            alt="BetterView Tourism" 
            className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1"
          />
          <div>
            <h1 className="font-display text-lg font-bold">BetterView</h1>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isParentActive(item.children)
                        ? "bg-secondary text-primary"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={onClose}
                          className={cn(
                            "block px-4 py-2 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "bg-secondary/20 text-secondary"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href!}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href!)
                      ? "bg-secondary text-primary"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Section - Fixed at Bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-primary">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-secondary/50">
              <AvatarFallback className="bg-secondary text-primary font-semibold text-sm">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userEmail || "Admin"}
              </p>
              <p className="text-xs text-white/50">Administrator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? "Logging out..." : "Sign out"}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
