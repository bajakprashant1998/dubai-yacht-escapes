import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Crown, Star, Clock, Check, ArrowRight, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useContactConfig } from "@/hooks/useContactConfig";
import { useFeaturedTours } from "@/hooks/useTours";
import TourCard from "@/components/TourCard";
import heroImage from "@/assets/dubai-marina-night.webp";

const cruiseCategories = [
  {
    name: "Dhow Cruises",
    slug: "dhow-cruises",
    icon: Ship,
    description: "Traditional Arabian dinner cruise experience",
    image: "/assets/tours/dhow-cruise-marina.jpg",
    priceFrom: 120,
    features: ["Buffet Dinner", "Live Entertainment", "Marina Views"],
  },
  {
    name: "Shared Yacht Tours",
    slug: "shared-yacht-tours",
    icon: Users,
    description: "Affordable luxury with live BBQ & swimming",
    image: "/assets/tours/yacht-bbq-experience.jpg",
    priceFrom: 180,
    features: ["BBQ on Deck", "Swimming Stop", "Small Groups"],
  },
  {
    name: "Private Charters",
    slug: "private-yacht-charter",
    icon: Anchor,
    description: "Exclusive yacht experience for your group",
    image: "/assets/tours/private-yacht-55ft.jpg",
    priceFrom: 800,
    features: ["Private Vessel", "Customizable", "Captain & Crew"],
  },
  {
    name: "Megayacht Dining",
    slug: "megayacht-experiences",
    icon: Crown,
    description: "Premium multi-deck cruise experience",
    image: "/assets/tours/megayacht-burj-khalifa.jpg",
    priceFrom: 350,
    features: ["5-Star Dining", "Multiple Decks", "VIP Service"],
  },
];

const whyChooseUs = [
  { title: "Best Prices Guaranteed", description: "We match or beat any competitor price" },
  { title: "Instant Confirmation", description: "Receive your booking confirmation immediately" },
  { title: "24/7 Support", description: "Our team is always available to assist you" },
  { title: "Free Cancellation", description: "Cancel up to 24h before for a full refund" },
];

const Cruises = () => {
  const { phoneFormatted, phone } = useContactConfig();
  const { data: featuredTours = [] } = useFeaturedTours();

  // Filter tours for cruise categories
  const cruiseTours = featuredTours.filter(tour => 
    tour.category.toLowerCase().includes('cruise') || 
    tour.category.toLowerCase().includes('yacht') ||
    tour.category.toLowerCase().includes('boat')
  ).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src={heroImage}
            alt="Dubai Marina yacht cruises"
            priority
            objectFit="cover"
            sizes="100vw"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/50" />
        </div>

        <div className="container relative z-10 py-20">
          <motion.div
            className="max-w-2xl text-primary-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/30">
              <Ship className="w-4 h-4" />
              <span className="text-sm font-semibold">Dubai's Premier Cruise Experiences</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Dhow Cruises &
              <span className="block text-secondary mt-2">Yacht Charters</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Experience Dubai's stunning skyline from the water. Choose from traditional dhow cruises, 
              shared yacht tours, or private charters for an unforgettable maritime adventure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="#categories">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 h-14 shadow-lg">
                  Explore Cruises
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href={`tel:${phone}`}>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 h-14">
                  <Phone className="w-5 h-5 mr-2" />
                  {phoneFormatted}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cruise Categories */}
      <section id="categories" className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
              Choose Your Experience
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Cruise Categories
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cruiseCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/dubai/${category.slug}`}>
                  <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white mb-2">
                          <category.icon className="w-5 h-5 text-secondary" />
                          <span className="font-display text-lg font-bold">{category.name}</span>
                        </div>
                        <p className="text-white/80 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-muted-foreground text-sm">From</span>
                        <span className="text-xl font-bold text-primary">AED {category.priceFrom}</span>
                      </div>
                      <ul className="space-y-1">
                        {category.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-secondary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cruise Tours */}
      {cruiseTours.length > 0 && (
        <section className="py-20">
          <div className="container">
            <motion.div
              className="flex flex-col md:flex-row md:items-end justify-between mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
                  Top Rated
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Featured Cruises
                </h2>
              </div>
              <Link to="/tours" className="mt-6 md:mt-0">
                <Button variant="outline" size="lg" className="font-semibold group">
                  View All Tours
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cruiseTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
              Why Book With Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              The BetterView Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-primary-foreground/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-3xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Set Sail?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Book your Dubai cruise experience today and create memories that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tours">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 h-14">
                  Browse All Cruises
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-semibold px-8 h-14">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Cruises;
