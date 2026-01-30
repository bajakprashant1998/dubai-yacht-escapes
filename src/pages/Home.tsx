import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedCombos from "@/components/home/FeaturedCombos";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";
import PartnersStrip from "@/components/home/PartnersStrip";
import CTASection from "@/components/home/CTASection";
import QuickServices from "@/components/home/QuickServices";
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
      <TrustStrip />
      <ExperienceCategories />
      <FeaturedCombos />
      <RecentlyViewedSection />
      <QuickServices />
      <PopularDestinations />
      <CategoryShowcase />
      <HowItWorks />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <NewsletterSection />
      <PartnersStrip />
      <CTASection />
    </Layout>
  );
};

export default Home;
