import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useVisaServices } from "@/hooks/useVisaServices";
import VisaCard from "@/components/visa/VisaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SortingTabs } from "@/components/ui/sorting-tabs";
import { FileText, Clock, Shield, CheckCircle, Zap, Globe, Users, HeadphonesIcon, ArrowUpDown, ThumbsUp, TrendingUp, Star } from "lucide-react";
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
  { icon: Users, value: "50,000+", label: "Visas Processed" },
  { icon: Clock, value: "24-48h", label: "Express Processing" },
  { icon: Globe, value: "100+", label: "Nationalities Served" },
  { icon: HeadphonesIcon, value: "24/7", label: "Customer Support" },
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
          // Recommended: featured first, then express, then by price
          if (a.is_express && !b.is_express) return -1;
          if (!a.is_express && b.is_express) return 1;
          return a.price - b.price;
      }
    });
  }, [filteredVisas, sortBy]);

  // Find most popular visa (lowest price tourist visa)
  const mostPopularId = useMemo(() => {
    const touristVisas = visas.filter(v => v.visa_type?.toLowerCase().includes("tourist"));
    if (touristVisas.length === 0) return null;
    return touristVisas.sort((a, b) => a.price - b.price)[0]?.id;
  }, [visas]);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-20 pt-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
          
          <div className="container relative z-10">
            <motion.div
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/20 mb-6">
                <FileText className="w-10 h-10 text-secondary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">UAE Visa Services</h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl">
                Get your UAE visa hassle-free. Fast processing, competitive prices, 
                and expert support for all visa types.
              </p>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center"
                >
                  <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        
        <div className="container py-12">
          {/* Filter Tabs & Sorting */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              {/* Visa Type Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {visaTypeFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Button
                      key={filter.value}
                      variant={activeFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.value)}
                      className={cn(
                        "gap-1.5",
                        activeFilter === filter.value && "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
              
              {/* Results Count & Sorting */}
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-sm">
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
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : sortedVisas.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border mb-16">
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
              {sortedVisas.map((visa) => (
                <div key={visa.id} className="relative">
                  {visa.id === mostPopularId && (
                    <div className="absolute -top-3 left-4 z-10">
                      <Badge className="bg-secondary text-secondary-foreground shadow-lg gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <VisaCard visa={visa} />
                </div>
              ))}
            </div>
          )}
          
          {/* How It Works */}
          <section className="mb-16">
            <div className="bg-card rounded-2xl border p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { step: 1, icon: FileText, title: "Choose Visa", desc: "Select the visa type that suits your travel needs" },
                  { step: 2, icon: Shield, title: "Submit Documents", desc: "Upload required documents through our secure portal" },
                  { step: 3, icon: Clock, title: "Processing", desc: "We process your application with UAE authorities" },
                  { step: 4, icon: CheckCircle, title: "Receive Visa", desc: "Get your e-visa delivered to your email" },
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
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary to-secondary/30" />
                    )}
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                        {item.step}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Trust Indicators */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, text: "Secure Process" },
                { icon: Clock, text: "Fast Turnaround" },
                { icon: CheckCircle, text: "99% Success Rate" },
                { icon: HeadphonesIcon, text: "24/7 Support" },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-card p-4 rounded-xl border"
                >
                  <item.icon className="w-6 h-6 text-secondary" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="bg-card rounded-xl border">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-b last:border-0">
                    <AccordionTrigger className="px-6 text-left hover:no-underline">
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
