import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCombos from "@/components/home/FeaturedCombos";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";
import PartnersStrip from "@/components/home/PartnersStrip";
import CTASection from "@/components/home/CTASection";
import QuickServices from "@/components/home/QuickServices";
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
      <HeroSection />
      {/* Spacer for overlapping hero cards */}
      <div className="pt-32 sm:pt-28 md:pt-32" />
      <ValuePillars />
      <FeaturedCombos />
      <RecentlyViewedSection />
      <QuickServices />
      <PopularDestinations />
      <HowItWorks />
      <TestimonialsCarousel />
      <NewsletterSection />
      <PartnersStrip />
      <CTASection />
    </Layout>
  );
};

export default Home;
