import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sun, 
  FerrisWheel, 
  Building2, 
  Waves, 
  MapPin, 
  Car, 
  UtensilsCrossed, 
  Mountain,
  ArrowRight,
  Shield,
  Clock,
  BadgeCheck,
  Phone,
  Landmark,
  Flower2,
  Fish,
  Droplets,
  Ship,
  Ticket
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useServices } from "@/hooks/useServices";
import { useContactConfig } from "@/hooks/useContactConfig";
import SEOHead from "@/components/SEOHead";

const experienceCategories = [
  {
    name: "Desert Safari",
    slug: "desert-safari",
    icon: Sun,
    description: "Thrilling desert adventures with dune bashing, camel rides, and BBQ dinner under the stars",
    image: "/assets/services/desert-safari.jpg",
  },
  {
    name: "Theme Parks",
    slug: "theme-parks",
    icon: FerrisWheel,
    description: "World-class theme parks including Dubai Parks, IMG Worlds, and Ski Dubai",
    image: "/assets/services/theme-parks.jpg",
  },
  {
    name: "Observation Decks",
    slug: "observation-decks",
    icon: Building2,
    description: "Breathtaking views from Burj Khalifa, Dubai Frame, Ain Dubai, and Aura Skypool",
    image: "/assets/services/observation-decks.jpg",
  },
  {
    name: "Water Sports",
    slug: "water-sports",
    icon: Waves,
    description: "Exciting water activities including jet skiing, flyboarding, parasailing, and scuba diving",
    image: "/assets/services/water-sports.jpg",
  },
  {
    name: "Museums & Attractions",
    slug: "museums-attractions",
    icon: Landmark,
    description: "Museum of the Future, AYA Universe, Madame Tussauds, and immersive experiences",
    image: "/assets/services/museums-attractions.jpg",
  },
  {
    name: "Zoos & Aquariums",
    slug: "zoos-aquariums",
    icon: Fish,
    description: "Dubai Aquarium, The Green Planet, Lost Chambers, and wildlife encounters",
    image: "/assets/services/zoos-aquariums.jpg",
  },
  {
    name: "Water Parks",
    slug: "water-parks",
    icon: Droplets,
    description: "Aquaventure Atlantis, Wild Wadi, Laguna Waterpark, and splash-filled adventures",
    image: "/assets/services/water-parks.jpg",
  },
  {
    name: "Parks & Gardens",
    slug: "parks-gardens",
    icon: Flower2,
    description: "Dubai Miracle Garden, Butterfly Garden, Safari Park, and natural escapes",
    image: "/assets/services/parks-gardens.jpg",
  },
  {
    name: "City Tours",
    slug: "city-tours",
    icon: MapPin,
    description: "Explore Dubai's landmarks, heritage sites, and hidden gems with expert guides",
    image: "/assets/services/city-tours.jpg",
  },
  {
    name: "Sightseeing Cruises",
    slug: "sightseeing-cruises",
    icon: Ship,
    description: "Dhow cruises, yacht tours, speed boats, and scenic marina experiences",
    image: "/assets/services/sightseeing-cruises.jpg",
  },
  {
    name: "Adventure Sports",
    slug: "adventure-sports",
    icon: Mountain,
    description: "Skydiving, hot air balloons, ziplines, helicopter tours, and dune buggies",
    image: "/assets/services/adventure-sports.jpg",
  },
  {
    name: "Dining Experiences",
    slug: "dining-experiences",
    icon: UtensilsCrossed,
    description: "At.mosphere Burj Khalifa, Burj Al Arab High Tea, and unforgettable culinary journeys",
    image: "/assets/services/dining-experiences.jpg",
  },
  {
    name: "Airport Transfers",
    slug: "airport-transfers",
    icon: Car,
    description: "Comfortable and reliable airport pickup and drop-off services",
    image: "/assets/services/airport-transfers.jpg",
  },
  {
    name: "Attraction Passes",
    slug: "attraction-passes",
    icon: Ticket,
    description: "Multi-attraction combo passes for maximum savings and flexibility",
    image: "/assets/services/attraction-passes.jpg",
  },
];

const trustBadges = [
  {
    icon: BadgeCheck,
    title: "Instant Confirmation",
    description: "Get immediate booking confirmation",
  },
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description: "We match any competitor's price",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service",
  },
];

const Experiences = () => {
  const { phone, phoneFormatted } = useContactConfig();
  const { data: services, isLoading } = useServices();
  
  const featuredServices = services?.filter(s => s.isFeatured)?.slice(0, 4) || [];

  return (
    <Layout>
      <SEOHead
        title="Dubai Activities & Experiences"
        description="Explore Dubai's best activities: desert safaris, theme parks, yacht tours, water sports, and more. Book unforgettable experiences with Betterview Tourism."
        canonical="/experiences"
        keywords={["Dubai activities", "Dubai experiences", "desert safari", "theme parks Dubai", "water sports Dubai", "Dubai tours"]}
      />
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/assets/services/city-tours.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        
        <div className="container relative z-10 text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Discover Dubai{" "}
              <span className="text-secondary">Activities</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              From thrilling desert adventures to sightseeing cruises, explore the best of Dubai with our curated collection of unforgettable activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8"
                asChild
              >
                <a href="#categories">
                  Browse Experiences
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8"
                asChild
              >
                <a href={`tel:${phone}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  {phoneFormatted}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section id="categories" className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide range of experiences, each designed to give you the best of Dubai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experienceCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/dubai/services/${category.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-primary-foreground">
                          <div className="w-10 h-10 rounded-lg bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                            <category.icon className="w-5 h-5 text-secondary" />
                          </div>
                          <h3 className="font-display font-semibold text-lg">{category.name}</h3>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                      <div className="mt-3 flex items-center text-secondary font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Explore <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      {featuredServices.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Activities
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our most popular activities, handpicked for an unforgettable Dubai adventure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link to={`/dubai/services/${service.categorySlug || 'general'}/${service.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.imageUrl || '/placeholder.svg'}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                        {service.originalPrice && service.originalPrice > service.price && (
                          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                            {Math.round((1 - service.price / service.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {service.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-secondary">AED {service.price}</span>
                            {service.originalPrice && service.originalPrice > service.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                AED {service.originalPrice}
                              </span>
                            )}
                          </div>
                          {service.duration && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.duration}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button asChild size="lg" variant="outline">
                <Link to="/services">
                  View All Activities
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <badge.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{badge.title}</h3>
                <p className="text-primary-foreground/70 text-sm">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              Ready to Explore Dubai?
            </h2>
            <p className="text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
              Let us help you plan the perfect Dubai adventure. Contact us today and our travel experts will create a customized itinerary just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                asChild
              >
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 font-semibold px-8"
                asChild
              >
                <a href={`tel:${phone}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Experiences;
