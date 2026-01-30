import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import FeaturedTours from "@/components/home/FeaturedTours";
import PopularDestinations from "@/components/home/PopularDestinations";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";
import PartnersStrip from "@/components/home/PartnersStrip";
import CTASection from "@/components/home/CTASection";
import QuickServices from "@/components/home/QuickServices";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustStrip />
      <ExperienceCategories />
      <FeaturedExperiences />
      <RecentlyViewedSection />
      <QuickServices />
      <PopularDestinations />
      <CategoryShowcase />
      <FeaturedTours />
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
