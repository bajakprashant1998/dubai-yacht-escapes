import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactConfig } from "@/hooks/useContactConfig";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

const categoryLabels: Record<string, string> = {
  booking: "Booking & Reservations",
  payment: "Payment & Pricing",
  cancellation: "Cancellation & Refunds",
  tours: "Tours & Experiences",
  contact: "Contact & Support",
  general: "General Questions",
};

const categoryIcons: Record<string, string> = {
  booking: "📅",
  payment: "💳",
  cancellation: "↩️",
  tours: "🚢",
  contact: "📞",
  general: "❓",
};

const FAQ = () => {
  const { phone, phoneFormatted, email, whatsappLink } = useContactConfig();

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("sort_order");

      if (error) throw error;
      return data as FAQ[];
    },
  });

  // Group FAQs by category
  const groupedFaqs = useMemo(() => {
    const groups: Record<string, FAQ[]> = {};
    faqs.forEach((faq) => {
      const cat = faq.category || "general";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(faq);
    });
    return groups;
  }, [faqs]);

  const categories = Object.keys(groupedFaqs);

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
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Help Center</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Find answers to common questions about booking, payments, cancellations, and our tours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No FAQs Available</h2>
              <p className="text-muted-foreground mb-6">
                Check back later or contact us directly for assistance.
              </p>
              <Link to="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((category, catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{categoryIcons[category] || "❓"}</span>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {categoryLabels[category] || category}
                    </h2>
                  </div>
                  <Accordion type="single" collapsible className="space-y-3">
                    {groupedFaqs[category].map((faq, index) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:text-secondary py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-4xl">
          <motion.div
            className="bg-card rounded-2xl p-8 md:p-12 text-center shadow-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MessageCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Our friendly support team is available 24/7 to help you with any queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
              <a href={`tel:${phone}`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Phone className="w-5 h-5 mr-2" />
                  {phoneFormatted}
                </Button>
              </a>
              <a href={`mailto:${email}`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
