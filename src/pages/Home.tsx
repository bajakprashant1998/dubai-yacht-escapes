import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import FeaturedCombos from "@/components/home/FeaturedCombos";
import FeaturedToursCarousel from "@/components/home/FeaturedToursCarousel";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";
import PartnersStrip from "@/components/home/PartnersStrip";
import CTASection from "@/components/home/CTASection";
import QuickServices from "@/components/home/QuickServices";
import PopularActivities from "@/components/home/PopularActivities";
import ValuePillars from "@/components/home/ValuePillars";
import SEOHead, { createLocalBusinessSchema } from "@/components/SEOHead";

const Home = () => {
  const structuredData = createLocalBusinessSchema();
  return (
    <Layout>
      <SEOHead
        canonical="/"
        structuredData={structuredData}
        keywords={["Dubai tours", "yacht charter Dubai", "desert safari", "theme parks Dubai", "Dubai experiences"]}
      />
      <PromotionalBanner />
      <HeroSection />
      <PopularDestinations />
      <PopularActivities />
      <FeaturedToursCarousel />
      <FeaturedCombos />
      <QuickServices />
      <ValuePillars />
      <RecentlyViewedSection />
      <TestimonialsCarousel />
      <HowItWorks />
      <NewsletterSection />
      <PartnersStrip />
      <CTASection />
    </Layout>
  );
};

export default Home;
