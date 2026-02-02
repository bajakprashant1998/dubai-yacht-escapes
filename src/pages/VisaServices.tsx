import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useVisaServices } from "@/hooks/useVisaServices";
import VisaCardPremium from "@/components/visa/VisaCardPremium";
import VisaFinderWizard from "@/components/visa/VisaFinderWizard";
import VisaComparisonTable from "@/components/visa/VisaComparisonTable";
import VisaHeroIllustration from "@/components/visa/VisaHeroIllustration";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SortingTabs } from "@/components/ui/sorting-tabs";
import { 
  FileText, Clock, Shield, CheckCircle, Zap, Globe, Users, HeadphonesIcon, 
  ArrowUpDown, ThumbsUp, TrendingUp, Star, Sparkles, Award, ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What documents are required for a UAE tourist visa?",
    answer: "You'll need a valid passport (with at least 6 months validity), a recent passport-size photograph, confirmed flight tickets, and hotel booking confirmation. Additional documents may be required based on nationality."
  },
  {
    question: "How long does visa processing take?",
    answer: "Standard processing takes 3-5 business days. Express processing is available for urgent requests, typically completing within 24-48 hours for an additional fee."
  },
  {
    question: "Can I extend my UAE visa?",
    answer: "Yes, visa extensions are possible for most visa types. You should apply for an extension at least 7 days before your current visa expires. Contact us for assistance with visa extensions."
  },
  {
    question: "What if my visa application is rejected?",
    answer: "In case of rejection, we'll inform you of the reason and guide you on the next steps. Depending on the rejection reason, you may be able to reapply with additional documentation."
  },
  {
    question: "Is travel insurance required for UAE visa?",
    answer: "Travel insurance is not mandatory but highly recommended. Some visa types may require proof of travel insurance covering the duration of your stay."
  },
];

const stats = [
  { icon: Users, value: "50,000+", label: "Visas Processed", color: "from-blue-500 to-indigo-600" },
  { icon: Clock, value: "24-48h", label: "Express Processing", color: "from-amber-500 to-orange-600" },
  { icon: Globe, value: "100+", label: "Nationalities Served", color: "from-emerald-500 to-teal-600" },
  { icon: Award, value: "99%", label: "Success Rate", color: "from-purple-500 to-pink-600" },
];

const visaTypeFilters = [
  { value: "all", label: "All Types" },
  { value: "tourist", label: "Tourist" },
  { value: "business", label: "Business" },
  { value: "transit", label: "Transit" },
  { value: "express", label: "Express", icon: Zap },
];

const sortOptions = [
  { value: "recommended", label: "Recommended", icon: TrendingUp },
  { value: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
  { value: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
  { value: "duration", label: "Longest Duration", icon: Clock },
];

const VisaServices = () => {
  const { data: visas = [], isLoading } = useVisaServices();
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showWizard, setShowWizard] = useState(false);

  // Filter visas based on selected type
  const filteredVisas = useMemo(() => {
    if (activeFilter === "all") return visas;
    if (activeFilter === "express") return visas.filter(v => v.is_express);
    return visas.filter(v => v.visa_type?.toLowerCase().includes(activeFilter));
  }, [visas, activeFilter]);

  // Sort visas
  const sortedVisas = useMemo(() => {
    return [...filteredVisas].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "duration":
          return (b.duration_days || 0) - (a.duration_days || 0);
        default:
          if (a.is_express && !b.is_express) return -1;
          if (!a.is_express && b.is_express) return 1;
          return a.price - b.price;
      }
    });
  }, [filteredVisas, sortBy]);

  // Find most popular visa
  const mostPopularId = useMemo(() => {
    const touristVisas = visas.filter(v => v.visa_type?.toLowerCase().includes("tourist"));
    if (touristVisas.length === 0) return null;
    return touristVisas.sort((a, b) => a.price - b.price)[0]?.id;
  }, [visas]);

  const handleWizardComplete = (filters: { nationality: string; purpose: string; duration: string }) => {
    if (filters.purpose === "tourism") setActiveFilter("tourist");
    else if (filters.purpose === "business") setActiveFilter("business");
    else if (filters.purpose === "transit") setActiveFilter("transit");
    setShowWizard(false);
    
    // Scroll to visa list
    document.getElementById("visa-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section - Split Layout */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/95 pt-24 pb-8 lg:pb-0">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
          </div>
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <motion.div
                className="text-center lg:text-left py-8 lg:py-16"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-secondary text-sm font-medium">Fast & Secure Processing</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                  UAE Visa
                  <span className="block text-secondary">Made Simple</span>
                </h1>
                
                <p className="text-primary-foreground/70 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-8">
                  Get your UAE visa hassle-free with our expert assistance. 
                  Fast processing, competitive prices, and 99% approval rate.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 h-14 px-8 text-lg rounded-xl"
                    onClick={() => setShowWizard(true)}
                  >
                    <Sparkles className="w-5 h-5" />
                    Find My Visa
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-14 px-8 text-lg rounded-xl gap-2"
                    onClick={() => document.getElementById("visa-list")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Browse All Visas
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
              
              {/* Right Illustration */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <VisaHeroIllustration />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="relative -mt-6 z-20 px-4">
          <motion.div
            className="container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br shadow-lg",
                      stat.color
                    )}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Visa Finder Wizard Modal */}
        {showWizard && (
          <section className="py-16 bg-muted/30">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto"
              >
                <div className="text-center mb-8">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-4">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Smart Visa Finder
                  </Badge>
                  <h2 className="text-3xl font-bold mb-2">Find Your Perfect Visa</h2>
                  <p className="text-muted-foreground">Answer a few questions to get personalized recommendations</p>
                </div>
                <VisaFinderWizard onComplete={handleWizardComplete} />
                <div className="text-center mt-4">
                  <Button variant="ghost" onClick={() => setShowWizard(false)}>
                    Skip & Browse All
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Comparison Table */}
        {!isLoading && visas.length >= 3 && (
          <section className="py-16 bg-muted/30">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Quick Compare
                </Badge>
                <h2 className="text-3xl font-bold mb-2">Compare Visa Options</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Not sure which visa is right for you? Compare features side-by-side
                </p>
              </motion.div>
              <VisaComparisonTable visas={visas} />
            </div>
          </section>
        )}
        
        <div id="visa-list" className="container py-16">
          {/* Filter Tabs & Sorting */}
          <div className="mb-10">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-2">All Visa Services</h2>
              <p className="text-muted-foreground">Choose from our range of visa options</p>
            </motion.div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              {/* Visa Type Filter Tabs */}
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                <div className="flex gap-2 min-w-max">
                  {visaTypeFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <Button
                        key={filter.value}
                        variant={activeFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(filter.value)}
                        className={cn(
                          "gap-1.5 whitespace-nowrap rounded-full px-5",
                          activeFilter === filter.value && "bg-secondary text-secondary-foreground"
                        )}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Results Count & Sorting */}
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm rounded-full">
                  {sortedVisas.length} visa{sortedVisas.length !== 1 ? "s" : ""} found
                </Badge>
                <SortingTabs
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="hidden md:flex"
                />
              </div>
            </div>
            
            {/* Mobile Sorting */}
            <div className="md:hidden">
              <SortingTabs
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-full overflow-x-auto"
              />
            </div>
          </div>
          
          {/* Visa Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedVisas.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border mb-16">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No visa services found</h3>
              <p className="text-muted-foreground mb-4">
                Try selecting a different visa type.
              </p>
              <Button variant="outline" onClick={() => setActiveFilter("all")}>
                View All Visas
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {sortedVisas.map((visa, index) => (
                <VisaCardPremium 
                  key={visa.id} 
                  visa={visa} 
                  isPopular={visa.id === mostPopularId}
                  index={index}
                />
              ))}
            </div>
          )}
          
          {/* How It Works */}
          <section className="mb-16">
            <motion.div 
              className="bg-gradient-to-br from-card via-card to-muted/30 rounded-3xl border p-8 md:p-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-10">
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-4">
                  Simple Process
                </Badge>
                <h2 className="text-3xl font-bold">How It Works</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: 1, icon: FileText, title: "Choose Visa", desc: "Select the visa type that suits your travel needs", color: "from-blue-500 to-indigo-600" },
                  { step: 2, icon: Shield, title: "Submit Documents", desc: "Upload required documents through our secure portal", color: "from-emerald-500 to-teal-600" },
                  { step: 3, icon: Clock, title: "Processing", desc: "We process your application with UAE authorities", color: "from-amber-500 to-orange-600" },
                  { step: 4, icon: CheckCircle, title: "Receive Visa", desc: "Get your e-visa delivered to your email", color: "from-purple-500 to-pink-600" },
                ].map((item, index) => (
                  <motion.div 
                    key={item.step} 
                    className="text-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {index < 3 && (
                      <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-border/30" />
                    )}
                    <div className="relative z-10">
                      <div className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br shadow-xl",
                        item.color
                      )}>
                        <item.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold -mt-6 relative z-20 border-4 border-card">
                        {item.step}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
          
          {/* Trust Indicators */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, text: "Secure Process", desc: "256-bit encryption" },
                { icon: Clock, text: "Fast Turnaround", desc: "24-48 hour express" },
                { icon: CheckCircle, text: "99% Success", desc: "High approval rate" },
                { icon: HeadphonesIcon, text: "24/7 Support", desc: "Always available" },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-card rounded-2xl border p-5 text-center hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.text}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* FAQs */}
          <section>
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-muted text-foreground mb-4">
                Got Questions?
              </Badge>
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </motion.div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="bg-card rounded-2xl border overflow-hidden">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-b last:border-0">
                    <AccordionTrigger className="px-6 text-left hover:no-underline hover:bg-muted/30 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default VisaServices;
