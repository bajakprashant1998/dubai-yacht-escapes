import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Locale = "en" | "ar";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.tours": "Tours",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.plan_trip": "Plan Trip",
    "nav.saved": "Saved",
    "nav.search": "Search",

    // Home sections
    "home.popular_destinations": "Popular Destinations",
    "home.popular_activities": "Popular Activities",
    "home.featured_combos": "Featured Combo Packages",
    "home.more_services": "More Dubai Services",
    "home.value_pillars": "Built for Exceptional Experiences",
    "home.recently_viewed": "Continue Exploring",
    "home.testimonials": "What Our Guests Say",
    "home.how_it_works": "How It Works",
    "home.newsletter": "Join Our Travel Community",
    "home.featured_tours": "Featured Tours",
    "home.view_all": "View All",
    "home.popular_experiences": "Popular Experiences",

    // Common
    "common.book_now": "Book Now",
    "common.view_details": "View Details",
    "common.per_person": "per person",
    "common.per_hour": "per hour",
    "common.read_more": "Read More",
    "common.show_more": "Show More",
    "common.loading": "Loading...",
    "common.no_results": "No results found",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.off": "OFF",

    // Auth
    "auth.sign_in": "Sign In",
    "auth.sign_up": "Sign Up",
    "auth.sign_out": "Sign Out",
    "auth.email": "Email",
    "auth.password": "Password",

    // Footer
    "footer.rights": "All rights reserved",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    // Wishlist
    "wishlist.added": "Added to wishlist",
    "wishlist.removed": "Removed from wishlist",
    "wishlist.price_alert": "Price Alert",
    "wishlist.sign_in_required": "Please sign in to save items",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.tours": "الجولات",
    "nav.blog": "المدونة",
    "nav.contact": "اتصل بنا",
    "nav.plan_trip": "خطط رحلتك",
    "nav.saved": "المحفوظات",
    "nav.search": "بحث",

    // Home sections
    "home.popular_destinations": "الوجهات الشائعة",
    "home.popular_activities": "الأنشطة الشائعة",
    "home.featured_combos": "باقات العروض المميزة",
    "home.more_services": "المزيد من خدمات دبي",
    "home.value_pillars": "مصمم لتجارب استثنائية",
    "home.recently_viewed": "تابع الاستكشاف",
    "home.testimonials": "ماذا يقول ضيوفنا",
    "home.how_it_works": "كيف يعمل",
    "home.newsletter": "انضم إلى مجتمع السفر لدينا",
    "home.featured_tours": "الجولات المميزة",
    "home.view_all": "عرض الكل",
    "home.popular_experiences": "التجارب الشائعة",

    // Common
    "common.book_now": "احجز الآن",
    "common.view_details": "عرض التفاصيل",
    "common.per_person": "للشخص",
    "common.per_hour": "في الساعة",
    "common.read_more": "اقرأ المزيد",
    "common.show_more": "عرض المزيد",
    "common.loading": "جاري التحميل...",
    "common.no_results": "لا توجد نتائج",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.all": "الكل",
    "common.off": "خصم",

    // Auth
    "auth.sign_in": "تسجيل الدخول",
    "auth.sign_up": "إنشاء حساب",
    "auth.sign_out": "تسجيل الخروج",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",

    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",

    // Wishlist
    "wishlist.added": "تمت الإضافة إلى المفضلة",
    "wishlist.removed": "تمت الإزالة من المفضلة",
    "wishlist.price_alert": "تنبيه السعر",
    "wishlist.sign_in_required": "يرجى تسجيل الدخول لحفظ العناصر",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return (saved === "ar" ? "ar" : "en") as Locale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string) => translations[locale][key] || translations.en[key] || key,
    [locale]
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: locale === "ar" ? "rtl" : "ltr",
        isRTL: locale === "ar",
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

export default I18nProvider;
