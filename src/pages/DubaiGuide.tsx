import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Sun, Thermometer, Calendar, Luggage, Heart, Shield,
  ChevronRight, Compass, Star, Globe, Camera, UtensilsCrossed,
  Building, Waves, TreePalm, ShoppingBag, Clock, ArrowRight
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const neighborhoods = [
  {
    name: "Dubai Marina",
    description: "Stunning waterfront living with skyscrapers, yacht clubs, and vibrant nightlife along a man-made canal.",
    highlights: ["JBR Beach Walk", "Marina Mall", "Yacht Tours", "Ain Dubai"],
    bestFor: "Nightlife & Waterfront",
    icon: Waves,
    link: "/dubai/services/sightseeing-cruises",
  },
  {
    name: "Downtown Dubai",
    description: "Home to the iconic Burj Khalifa, Dubai Mall, and the spectacular Dubai Fountain shows.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Dubai Fountain", "Souk Al Bahar"],
    bestFor: "Landmarks & Shopping",
    icon: Building,
    link: "/experiences",
  },
  {
    name: "Old Dubai (Deira & Bur Dubai)",
    description: "Explore the heritage side with traditional souks, abra rides across Dubai Creek, and spice markets.",
    highlights: ["Gold Souk", "Spice Souk", "Dubai Museum", "Abra Rides"],
    bestFor: "Culture & Heritage",
    icon: Compass,
    link: "/dubai/services/city-tours",
  },
  {
    name: "Palm Jumeirah",
    description: "The world-famous palm-shaped island featuring luxury resorts, Aquaventure Waterpark, and pristine beaches.",
    highlights: ["Atlantis", "Aquaventure", "The Pointe", "Beach Clubs"],
    bestFor: "Luxury & Beaches",
    icon: TreePalm,
    link: "/dubai/services/water-sports",
  },
  {
    name: "Jumeirah",
    description: "An upscale residential area with beautiful beaches, boutique cafes, and the iconic Burj Al Arab.",
    highlights: ["Burj Al Arab", "Kite Beach", "La Mer", "Madinat Jumeirah"],
    bestFor: "Beachside Relaxation",
    icon: Sun,
    link: "/tours",
  },
  {
    name: "Dubai Desert",
    description: "Experience thrilling dune bashing, camel rides, stargazing, and traditional Bedouin-style camps.",
    highlights: ["Dune Bashing", "Camel Rides", "BBQ Dinner", "Stargazing"],
    bestFor: "Adventure & Culture",
    icon: Thermometer,
    link: "/dubai/services/desert-safari",
  },
];

const seasonalGuide = [
  {
    season: "Winter (Nov–Feb)",
    temp: "20–26°C",
    weather: "Pleasant & Sunny",
    crowd: "Peak Season",
    highlights: ["Dubai Shopping Festival", "NYE Fireworks", "Global Village", "Outdoor Activities"],
    tip: "Book 2-3 months ahead for best rates. Perfect weather for desert safaris and beach days.",
    color: "bg-secondary/10 border-secondary/30",
  },
  {
    season: "Spring (Mar–Apr)",
    temp: "26–34°C",
    weather: "Warm",
    crowd: "Shoulder Season",
    highlights: ["Art Dubai", "Dubai World Cup", "Water Sports", "Theme Parks"],
    tip: "Great value with fewer crowds. Ideal for outdoor exploring before summer heat.",
    color: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    season: "Summer (May–Sep)",
    temp: "35–45°C",
    weather: "Very Hot & Humid",
    crowd: "Low Season",
    highlights: ["Dubai Summer Surprises", "Indoor Attractions", "Mall Sales", "Water Parks"],
    tip: "Best hotel deals of the year. Stick to indoor attractions and evening activities.",
    color: "bg-amber-500/10 border-amber-500/30",
  },
  {
    season: "Autumn (Oct)",
    temp: "28–36°C",
    weather: "Cooling Down",
    crowd: "Shoulder Season",
    highlights: ["Halloween Events", "Outdoor Markets", "Restaurant Week", "New Openings"],
    tip: "Temperatures start dropping. A sweet spot for fewer crowds and reasonable prices.",
    color: "bg-purple-500/10 border-purple-500/30",
  },
];

const essentialTips = [
  { icon: Shield, title: "Dress Code", description: "Dress modestly in public areas. Swimwear is fine at beaches and pools. Cover shoulders and knees in malls and cultural sites." },
  { icon: Camera, title: "Photography", description: "Avoid photographing people without permission, especially women. No photos of military or government buildings." },
  { icon: Globe, title: "Language", description: "Arabic is official, but English is widely spoken. Most signs, menus, and services are in English." },
  { icon: UtensilsCrossed, title: "Dining", description: "Tipping 10-15% is customary. Pork and alcohol are available at licensed restaurants and hotels only." },
  { icon: Clock, title: "Timing", description: "Friday-Saturday is the weekend. Many attractions have ladies-only hours. Ramadan hours differ significantly." },
  { icon: ShoppingBag, title: "Shopping", description: "Bargaining is expected in souks but not in malls. Tax-free shopping with tourist refund scheme available." },
];

const packingChecklist = [
  "Lightweight, breathable clothing",
  "Sunscreen SPF 50+",
  "Comfortable walking shoes",
  "Modest cover-ups for mosques",
  "Sunglasses & wide-brim hat",
  "Reusable water bottle",
  "Universal power adapter (UK type)",
  "Light jacket for AC indoors",
  "Swimwear for hotels/beaches",
  "Passport & visa documents",
];

const DubaiGuide = () => {
  const [activeTab, setActiveTab] = useState("neighborhoods");

  return (
    <Layout>
      <SEOHead
        title="Dubai Travel Guide 2026 | Everything You Need to Know"
        description="The ultimate Dubai travel guide — best neighborhoods, when to visit, cultural tips, packing lists, and hidden gems. Plan your perfect Dubai trip."
        canonical="/dubai-guide"
        keywords={["Dubai travel guide", "best time to visit Dubai", "Dubai neighborhoods", "Dubai tips", "Dubai culture"]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary/20 text-primary-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-secondary/50 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 mb-4">
              <Compass className="w-3 h-3 mr-1" /> Complete Travel Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Your Ultimate Dubai <span className="text-secondary">Travel Guide</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
              Everything you need to know before visiting Dubai — from neighborhood guides to cultural etiquette, seasonal tips, and hidden gems.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/plan-trip"><Star className="w-4 h-4 mr-2" />Plan Your Trip</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/events"><Calendar className="w-4 h-4 mr-2" />Dubai Events</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl mb-8">
            <TabsTrigger value="neighborhoods" className="flex-1 min-w-[120px]">
              <MapPin className="w-4 h-4 mr-1.5" /> Neighborhoods
            </TabsTrigger>
            <TabsTrigger value="when-to-visit" className="flex-1 min-w-[120px]">
              <Calendar className="w-4 h-4 mr-1.5" /> When to Visit
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex-1 min-w-[120px]">
              <Heart className="w-4 h-4 mr-1.5" /> Cultural Tips
            </TabsTrigger>
            <TabsTrigger value="packing" className="flex-1 min-w-[120px]">
              <Luggage className="w-4 h-4 mr-1.5" /> Packing List
            </TabsTrigger>
          </TabsList>

          {/* Neighborhoods */}
          <TabsContent value="neighborhoods">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Explore Dubai's Best Neighborhoods</h2>
              <p className="text-muted-foreground">Each area of Dubai offers a unique personality and experience.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighborhoods.map((n, i) => (
                <motion.div
                  key={n.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all group border-border/50 hover:border-secondary/40">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <n.icon className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{n.name}</h3>
                          <Badge variant="outline" className="text-xs">{n.bestFor}</Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{n.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {n.highlights.map((h) => (
                          <Badge key={h} variant="secondary" className="text-xs bg-muted text-muted-foreground">{h}</Badge>
                        ))}
                      </div>
                      <Link to={n.link} className="text-secondary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* When to Visit */}
          <TabsContent value="when-to-visit">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Best Time to Visit Dubai</h2>
              <p className="text-muted-foreground">Dubai is a year-round destination, but each season offers a different experience.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {seasonalGuide.map((s, i) => (
                <motion.div
                  key={s.season}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`h-full border ${s.color}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-foreground">{s.season}</h3>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-foreground">{s.temp}</div>
                          <div className="text-xs text-muted-foreground">{s.weather}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="mb-3">{s.crowd}</Badge>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {s.highlights.map((h) => (
                          <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic">💡 {s.tip}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Cultural Tips */}
          <TabsContent value="tips">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Cultural Etiquette & Essential Tips</h2>
              <p className="text-muted-foreground">Dubai is cosmopolitan but respects local customs. Here's what to know.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialTips.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                        <tip.icon className="w-5 h-5 text-secondary" />
                      </div>
                      <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Packing List */}
          <TabsContent value="packing">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Dubai Packing Checklist</h2>
              <p className="text-muted-foreground">Don't forget these essentials for your Dubai trip.</p>
            </div>
            <Card className="max-w-2xl">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {packingChecklist.map((item, i) => (
                    <motion.label
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <input type="checkbox" className="w-4 h-4 rounded border-border accent-secondary" />
                      <span className="text-foreground">{item}</span>
                    </motion.label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Experience Dubai?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Let our AI trip planner create a personalized itinerary based on your interests, budget, and travel dates.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
              <Link to="/plan-trip">Plan My Trip <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/events">Browse Events <Calendar className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/combo-packages">View Packages <ChevronRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DubaiGuide;
