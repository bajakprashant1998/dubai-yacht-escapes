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
  Megaphone,
  BarChart3,
  DollarSign,
  Package,
  ClipboardList,
  Send,
  Brain,
  Layers,
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

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { title: "Reports", href: "/admin/reports", icon: FileText },
      { title: "Activity Log", href: "/admin/activity-log", icon: History },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Bookings", href: "/admin/bookings", icon: Calendar },
      { title: "Booking Calendar", href: "/admin/booking-calendar", icon: Calendar },
      { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { title: "Live Chat", href: "/admin/live-chat", icon: Headset },
      { title: "Inventory", href: "/admin/inventory", icon: Package },
      { title: "Staff Tasks", href: "/admin/staff-tasks", icon: ClipboardList },
      { title: "Refunds", href: "/admin/refunds", icon: DollarSign },
    ],
  },
  {
    label: "Content",
    items: [
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
      {
        title: "Combo Packages",
        icon: Layers,
        children: [
          { title: "All Combos", href: "/admin/combo-packages" },
          { title: "Add Combo", href: "/admin/combo-packages/add" },
          { title: "Package Types", href: "/admin/combo-packages/types" },
          { title: "AI Rules", href: "/admin/combo-packages/ai-rules" },
        ],
      },
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
      { title: "Locations", href: "/admin/locations", icon: MapPin },
      { title: "Gallery", href: "/admin/gallery", icon: Image },
      { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    label: "AI & Planning",
    items: [
      { title: "AI Trip Planner", href: "/admin/ai-trips", icon: Plane },
      { title: "Group Trips", href: "/admin/group-trips", icon: Users },
    ],
  },
  {
    label: "Marketing",
    items: [
      { title: "Customers", href: "/admin/customers", icon: Users },
      { title: "Discounts", href: "/admin/discounts", icon: Percent },
      { title: "Reviews", href: "/admin/reviews", icon: Star },
      { title: "Review Rewards", href: "/admin/review-rewards", icon: Star },
      { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { title: "Banners", href: "/admin/banners", icon: Megaphone },
      { title: "Email Sequences", href: "/admin/email-sequences", icon: Send },
      { title: "Corporate Events", href: "/admin/corporate-events", icon: Building },
      { title: "Influencer Portal", href: "/admin/influencer-portal", icon: Megaphone },
    ],
  },
  {
    label: "System",
    items: [
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-expand parent items that contain the active route
  useEffect(() => {
    const activeParents: string[] = [];
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children?.some((child) => location.pathname === child.href)) {
          activeParents.push(item.title);
        }
      });
    });
    setExpandedItems((prev) => {
      const merged = new Set([...prev, ...activeParents]);
      return Array.from(merged);
    });
  }, [location.pathname]);

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

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
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

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpand(item.title)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isParentActive(item.children)
                ? "bg-secondary text-primary"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            <span className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.title}
            </span>
            {expandedItems.includes(item.title) ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
          {expandedItems.includes(item.title) && (
            <div className="ml-7 mt-0.5 space-y-0.5 border-l border-white/10 pl-2.5">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  onClick={onClose}
                  className={cn(
                    "block px-3 py-1.5 rounded-md text-xs transition-colors",
                    isActive(child.href)
                      ? "bg-secondary/20 text-secondary font-medium"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href!}
        onClick={onClose}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive(item.href!)
            ? "bg-secondary text-primary"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {item.title}
      </Link>
    );
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
          "fixed left-0 top-0 z-50 h-full w-60 bg-primary text-white transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <img
            src={betterviewLogo}
            alt="BetterView Tourism"
            className="w-8 h-8 object-contain rounded-lg bg-white/10 p-0.5"
          />
          <div>
            <h1 className="font-display text-base font-bold leading-tight">BetterView</h1>
            <p className="text-[10px] text-white/50">Admin Panel</p>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4 scrollbar-thin">
          {navSections.map((section) => {
            const isCollapsed = collapsedSections.includes(section.label);
            return (
              <div key={section.label}>
                <button
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-1 mb-1.5 group"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35 group-hover:text-white/55 transition-colors">
                    {section.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-white/25 transition-transform",
                      isCollapsed && "-rotate-90"
                    )}
                  />
                </button>
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {section.items.map(renderNavItem)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Section - Fixed at Bottom */}
        <div className="flex-shrink-0 px-3 py-3 border-t border-white/10 bg-primary pb-safe">
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar className="h-8 w-8 border border-secondary/40">
              <AvatarFallback className="bg-secondary text-primary font-semibold text-xs">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate max-w-[130px]">
                {userEmail || "Admin"}
              </p>
              <p className="text-[10px] text-white/45">Administrator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 h-8 text-xs"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            {isLoggingOut ? "Logging out..." : "Sign out"}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
