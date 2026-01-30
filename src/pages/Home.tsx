import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import ExperienceCategories from "@/components/home/ExperienceCategories";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedExperiences from "@/components/home/FeaturedExperiences";
import FeaturedTours from "@/components/home/FeaturedTours";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CTASection from "@/components/home/CTASection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustStrip />
      <ExperienceCategories />
      <FeaturedExperiences />
      <CategoryShowcase />
      <FeaturedTours />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <CTASection />
    </Layout>
  );
};

export default Home;
