import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Compass, 
  Sun, 
  Wallet, 
  Camera, 
  Utensils, 
  ShieldCheck,
  Plane,
  Clock,
  Thermometer,
  Shirt
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
  {
    icon: Thermometer,
    title: "Best Time to Visit",
    description: "The ideal time to visit Dubai is from November to March when temperatures are pleasant (20-30°C). Summer months can be extremely hot.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shirt,
    title: "Dress Code",
    description: "Dubai is cosmopolitan but respectful dressing is appreciated. Cover shoulders and knees in malls and public places. Beachwear is fine at beaches and pools.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wallet,
    title: "Currency & Payments",
    description: "The local currency is AED (Dirham). Credit cards are widely accepted. ATMs are readily available throughout the city.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sun,
    title: "Sun Protection",
    description: "The UAE sun is strong year-round. Always carry sunscreen (SPF 50+), sunglasses, and stay hydrated. Most outdoor activities provide shade.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Camera,
    title: "Photography Tips",
    description: "Golden hour (sunrise/sunset) offers the best lighting for photos. Always ask permission before photographing people. Some government buildings prohibit photos.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Utensils,
    title: "Food & Dining",
    description: "Dubai offers incredible culinary diversity. Try local Emirati dishes like Al Harees and Machboos. Most restaurants cater to all dietary requirements.",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: Plane,
    title: "Transportation",
    description: "Dubai has excellent transport: Metro, buses, taxis, and ride-sharing apps. For cruises and tours, most include hotel pickup service.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Clock,
    title: "Time Zone",
    description: "Dubai operates on Gulf Standard Time (GMT+4). There's no daylight saving time. Plan accordingly when booking tours or restaurants.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: ShieldCheck,
    title: "Safety Tips",
    description: "Dubai is one of the safest cities in the world. Standard precautions apply. Keep valuables secure and stay hydrated in the heat.",
    color: "from-emerald-500 to-green-500",
  },
];

const cruiseTips = [
  "Arrive at least 15-30 minutes before your scheduled departure time",
  "Bring a light jacket for evening cruises as it can get breezy on the water",
  "Cameras are a must - the views of Dubai's skyline are spectacular",
  "Wear comfortable shoes as you may be walking on deck",
  "Apply seasickness remedies beforehand if you're prone to motion sickness",
  "Don't forget to try the traditional Arabic coffee and dates served onboard",
];

const TravelTips = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20 md:py-28">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/30">
              <Compass className="w-4 h-4" />
              <span className="text-sm font-semibold">Travel Guide</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Dubai Travel Tips
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Everything you need to know for an unforgettable Dubai experience.
              From weather to culture, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <tip.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="font-display text-xl">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cruise Specific Tips */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
                For Cruise Guests
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Cruise Experience Tips
              </h2>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {cruiseTips.map((tip, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-secondary font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-foreground">{tip}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            className="bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-3xl p-8 md:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Explore Dubai?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Book your experiences now and create unforgettable memories in the city of wonders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/experiences">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 h-14">
                  Browse Experiences
                </Button>
              </Link>
              <Link to="/faq">
                <Button size="lg" variant="outline" className="font-semibold px-8 h-14">
                  View FAQ
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TravelTips;
