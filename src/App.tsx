import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { I18nProvider } from "@/lib/i18n";

import ScrollToTop from "./components/ScrollToTop";

// Critical path - load immediately
import Home from "./pages/Home";

// Lazy-loaded pages for code splitting
const Tours = lazy(() => import("./pages/Tours"));
const TourDetail = lazy(() => import("./pages/TourDetail"));
const Services = lazy(() => import("./pages/Services"));
const Experiences = lazy(() => import("./pages/Experiences"));
// Cruises page redirects to sightseeing-cruises category
import { Navigate } from "react-router-dom";
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const SavedTours = lazy(() => import("./pages/SavedTours"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TravelTips = lazy(() => import("./pages/TravelTips"));
const NotFound = lazy(() => import("./pages/NotFound"));

// New module pages
const CarRentals = lazy(() => import("./pages/CarRentals"));
const CarRentalDetail = lazy(() => import("./pages/CarRentalDetail"));
const Hotels = lazy(() => import("./pages/Hotels"));
const HotelDetail = lazy(() => import("./pages/HotelDetail"));
const VisaServicesPage = lazy(() => import("./pages/VisaServices"));
const VisaServiceDetail = lazy(() => import("./pages/VisaServiceDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));

// AI Trip Planner pages
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const TripItinerary = lazy(() => import("./pages/TripItinerary"));
// Combo Packages
const ComboPackages = lazy(() => import("./pages/ComboPackages"));
const ComboPackageDetail = lazy(() => import("./pages/ComboPackageDetail"));
// Admin pages - lazy load entire admin section
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminInquiries = lazy(() => import("./pages/admin/Inquiries"));
const AdminTours = lazy(() => import("./pages/admin/Tours"));
const AdminAddTour = lazy(() => import("./pages/admin/AddTour"));
const AdminEditTour = lazy(() => import("./pages/admin/EditTour"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminLocations = lazy(() => import("./pages/admin/Locations"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminDiscounts = lazy(() => import("./pages/admin/Discounts"));
const AdminUploadTourImages = lazy(() => import("./pages/admin/UploadTourImages"));
const AdminActivityLog = lazy(() => import("./pages/admin/ActivityLog"));
const AdminLegalPages = lazy(() => import("./pages/admin/LegalPages"));
const AdminLiveChat = lazy(() => import("./pages/admin/LiveChat"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const AdminAddService = lazy(() => import("./pages/admin/AddService"));
const AdminEditService = lazy(() => import("./pages/admin/EditService"));
const AdminFAQ = lazy(() => import("./pages/admin/FAQ"));
const AdminServiceCategories = lazy(() => import("./pages/admin/ServiceCategories"));
const AdminRoles = lazy(() => import("./pages/admin/Roles"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const AdminCarRentals = lazy(() => import("./pages/admin/CarRentals"));
const AdminAddCarRental = lazy(() => import("./pages/admin/AddCarRental"));
const AdminEditCarRental = lazy(() => import("./pages/admin/EditCarRental"));
const AdminCarCategories = lazy(() => import("./pages/admin/CarCategories"));
const AdminHotels = lazy(() => import("./pages/admin/Hotels"));
const AdminAddHotel = lazy(() => import("./pages/admin/AddHotel"));
const AdminEditHotel = lazy(() => import("./pages/admin/EditHotel"));
const AdminVisaServices = lazy(() => import("./pages/admin/VisaServices"));
const AdminAddVisaService = lazy(() => import("./pages/admin/AddVisaService"));
const AdminEditVisaService = lazy(() => import("./pages/admin/EditVisaService"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminAddBlogPost = lazy(() => import("./pages/admin/AddBlogPost"));
const AdminEditBlogPost = lazy(() => import("./pages/admin/EditBlogPost"));
const AdminBlogCategories = lazy(() => import("./pages/admin/BlogCategories"));
const AdminNewsletter = lazy(() => import("./pages/admin/Newsletter"));
const AdminAITripDashboard = lazy(() => import("./pages/admin/AITripDashboard"));
const AdminComboPackages = lazy(() => import("./pages/admin/ComboPackages"));
const AdminAddComboPackage = lazy(() => import("./pages/admin/AddComboPackage"));
const AdminEditComboPackage = lazy(() => import("./pages/admin/EditComboPackage"));
const AdminComboAIRules = lazy(() => import("./pages/admin/ComboAIRules"));
const AdminComboTypes = lazy(() => import("./pages/admin/ComboTypes"));
const AdminBanners = lazy(() => import("./pages/admin/Banners"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
// RequireSession must be loaded synchronously as it's a wrapper component
import RequireSession from "./components/admin/RequireSession";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  </div>
);

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tours" element={<Tours />} />
            {/* New SEO-friendly tour routes */}
            <Route path="/dubai/:categoryPath/:slug" element={<TourDetail />} />
            <Route path="/dubai/:categoryPath" element={<Tours />} />
            {/* Legacy route - kept for backwards compatibility */}
            <Route path="/tours/:slug" element={<TourDetail />} />
            {/* Activities routes */}
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/cruises" element={<Navigate to="/dubai/services/sightseeing-cruises" replace />} />
            <Route path="/services" element={<Services />} />
            <Route path="/dubai/services/:categoryPath" element={<Services />} />
            <Route path="/dubai/services/:categoryPath/:slug" element={<ServiceDetail />} />
            <Route path="/saved-tours" element={<SavedTours />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/travel-tips" element={<TravelTips />} />
            {/* Car Rentals */}
            <Route path="/car-rentals" element={<CarRentals />} />
            <Route path="/car-rentals/:categorySlug" element={<CarRentals />} />
            <Route path="/car-rentals/:categorySlug/:slug" element={<CarRentalDetail />} />
            {/* Hotels */}
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:category" element={<Hotels />} />
            <Route path="/hotels/:category/:slug" element={<HotelDetail />} />
            {/* Visa Services */}
            <Route path="/visa-services" element={<VisaServicesPage />} />
            <Route path="/visa-services/:slug" element={<VisaServiceDetail />} />
            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/category/:categorySlug" element={<BlogCategory />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* AI Trip Planner */}
            <Route path="/plan-trip" element={<TripPlanner />} />
            <Route path="/trip/:tripId" element={<TripItinerary />} />
            {/* Combo Packages */}
            <Route path="/combo-packages" element={<ComboPackages />} />
            <Route path="/combo-packages/:slug" element={<ComboPackageDetail />} />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireSession>
                  <AdminDashboard />
                </RequireSession>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <RequireSession>
                  <AdminBookings />
                </RequireSession>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <RequireSession>
                  <AdminInquiries />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours"
              element={
                <RequireSession>
                  <AdminTours />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours/add"
              element={
                <RequireSession>
                  <AdminAddTour />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours/edit/:slug"
              element={
                <RequireSession>
                  <AdminEditTour />
                </RequireSession>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <RequireSession>
                  <AdminReviews />
                </RequireSession>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <RequireSession>
                  <AdminGallery />
                </RequireSession>
              }
            />
            <Route
              path="/admin/settings/*"
              element={
                <RequireSession>
                  <AdminSettings />
                </RequireSession>
              }
            />
            <Route
              path="/admin/locations"
              element={
                <RequireSession>
                  <AdminLocations />
                </RequireSession>
              }
            />
            <Route
              path="/admin/tours/categories"
              element={
                <RequireSession>
                  <AdminCategories />
                </RequireSession>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <RequireSession>
                  <AdminCustomers />
                </RequireSession>
              }
            />
            <Route
              path="/admin/discounts"
              element={
                <RequireSession>
                  <AdminDiscounts />
                </RequireSession>
              }
            />
            <Route
              path="/admin/upload-images"
              element={
                <RequireSession>
                  <AdminUploadTourImages />
                </RequireSession>
              }
            />
            <Route
              path="/admin/activity-log"
              element={
                <RequireSession>
                  <AdminActivityLog />
                </RequireSession>
              }
            />
            <Route
              path="/admin/legal-pages"
              element={
                <RequireSession>
                  <AdminLegalPages />
                </RequireSession>
              }
            />
            <Route
              path="/admin/live-chat"
              element={
                <RequireSession>
                  <AdminLiveChat />
                </RequireSession>
              }
            />
            {/* Admin Services Routes */}
            <Route
              path="/admin/services"
              element={
                <RequireSession>
                  <AdminServices />
                </RequireSession>
              }
            />
            <Route
              path="/admin/services/add"
              element={
                <RequireSession>
                  <AdminAddService />
                </RequireSession>
              }
            />
            <Route
              path="/admin/services/edit/:slug"
              element={
                <RequireSession>
                  <AdminEditService />
                </RequireSession>
              }
            />
            <Route
              path="/admin/services/categories"
              element={
                <RequireSession>
                  <AdminServiceCategories />
                </RequireSession>
              }
            />
            <Route
              path="/admin/faqs"
              element={
                <RequireSession>
                  <AdminFAQ />
                </RequireSession>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <RequireSession requiredRoles={["admin"]}>
                  <AdminRoles />
                </RequireSession>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireSession requiredRoles={["admin", "manager"]}>
                  <AdminUsers />
                </RequireSession>
              }
            />
            {/* Car Rentals Admin */}
            <Route path="/admin/car-rentals" element={<RequireSession><AdminCarRentals /></RequireSession>} />
            <Route path="/admin/car-rentals/add" element={<RequireSession><AdminAddCarRental /></RequireSession>} />
            <Route path="/admin/car-rentals/edit/:slug" element={<RequireSession><AdminEditCarRental /></RequireSession>} />
            <Route path="/admin/car-rentals/categories" element={<RequireSession><AdminCarCategories /></RequireSession>} />
            {/* Hotels Admin */}
            <Route path="/admin/hotels" element={<RequireSession><AdminHotels /></RequireSession>} />
            <Route path="/admin/hotels/add" element={<RequireSession><AdminAddHotel /></RequireSession>} />
            <Route path="/admin/hotels/edit/:slug" element={<RequireSession><AdminEditHotel /></RequireSession>} />
            {/* Visa Services Admin */}
            <Route path="/admin/visa-services" element={<RequireSession><AdminVisaServices /></RequireSession>} />
            <Route path="/admin/visa-services/add" element={<RequireSession><AdminAddVisaService /></RequireSession>} />
            <Route path="/admin/visa-services/edit/:slug" element={<RequireSession><AdminEditVisaService /></RequireSession>} />
            {/* Blog Admin */}
            <Route path="/admin/blog" element={<RequireSession><AdminBlog /></RequireSession>} />
            <Route path="/admin/blog/add" element={<RequireSession><AdminAddBlogPost /></RequireSession>} />
            <Route path="/admin/blog/edit/:slug" element={<RequireSession><AdminEditBlogPost /></RequireSession>} />
            <Route path="/admin/blog/categories" element={<RequireSession><AdminBlogCategories /></RequireSession>} />
            {/* Newsletter Admin */}
            <Route path="/admin/newsletter" element={<RequireSession><AdminNewsletter /></RequireSession>} />
            {/* AI Trip Dashboard Admin */}
            <Route path="/admin/ai-trips" element={<RequireSession><AdminAITripDashboard /></RequireSession>} />
            {/* Combo Packages Admin */}
            <Route path="/admin/combo-packages" element={<RequireSession><AdminComboPackages /></RequireSession>} />
            <Route path="/admin/combo-packages/add" element={<RequireSession><AdminAddComboPackage /></RequireSession>} />
            <Route path="/admin/combo-packages/edit/:slug" element={<RequireSession><AdminEditComboPackage /></RequireSession>} />
            <Route path="/admin/combo-packages/ai-rules" element={<RequireSession><AdminComboAIRules /></RequireSession>} />
            <Route path="/admin/combo-packages/types" element={<RequireSession><AdminComboTypes /></RequireSession>} />
            {/* Banners & Analytics Admin */}
            <Route path="/admin/banners" element={<RequireSession><AdminBanners /></RequireSession>} />
            <Route path="/admin/analytics" element={<RequireSession><AdminAnalytics /></RequireSession>} />
            {/* Customer Dashboard */}
            <Route path="/dashboard" element={<CustomerDashboard />} />
            {/* Auth routes */}
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
