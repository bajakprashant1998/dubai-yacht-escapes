import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useVisaService, useVisaServices } from "@/hooks/useVisaServices";
import VisaRequirements from "@/components/visa/VisaRequirements";
import VisaApplicationForm from "@/components/visa/VisaApplicationForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ChevronLeft, 
  Clock, 
  FileText, 
  Zap, 
  CheckCircle, 
  Calendar, 
  Shield,
  MessageCircle,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useContactConfig } from "@/hooks/useContactConfig";

const processSteps = [
  { step: 1, title: "Submit Application", description: "Fill out the form with your details" },
  { step: 2, title: "Upload Documents", description: "Provide required documents" },
  { step: 3, title: "Processing", description: "We handle the visa process" },
  { step: 4, title: "Receive Visa", description: "Get visa via email" },
];

const VisaServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: visa, isLoading, error } = useVisaService(slug || "");
  const { data: allVisas = [] } = useVisaServices();
  const { whatsapp } = useContactConfig();
  
  // Get related visas (different from current)
  const relatedVisas = allVisas.filter(v => v.id !== visa?.id).slice(0, 3);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-6xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !visa) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Visa Service Not Found</h1>
            <Link to="/visa-services">
              <Button>Back to Visa Services</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const hasDiscount = visa.original_price && visa.original_price > visa.price;

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
          
          <div className="container max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <Link
              to="/visa-services"
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Visa Services
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {visa.is_express && (
                  <Badge className="bg-amber-500 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Express Processing
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge variant="destructive">
                    Save AED {visa.original_price! - visa.price}
                  </Badge>
                )}
                <Badge variant="secondary">{visa.visa_type}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{visa.title}</h1>
              
              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3">
                {visa.duration_days && (
                  <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{visa.duration_days} Days</span>
                  </div>
                )}
                {visa.validity && (
                  <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">{visa.validity}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{visa.processing_time}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container max-w-6xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Process Timeline */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Application Process</h2>
                  <div className="relative">
                    <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-secondary/20" />
                    <div className="space-y-6">
                      {processSteps.map((item, index) => (
                        <motion.div
                          key={item.step}
                          className="flex gap-4 relative"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center relative z-10 flex-shrink-0">
                            <span className="text-secondary font-bold">{item.step}</span>
                          </div>
                          <div className="pt-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Description */}
              {visa.long_description && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About This Visa</h2>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {visa.long_description}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Requirements */}
              <VisaRequirements visa={visa} />
              
              {/* FAQs */}
              {visa.faqs.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="bg-card rounded-xl border">
                    {visa.faqs.map((faq, index) => (
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
                </section>
              )}
              
              {/* Related Visas */}
              {relatedVisas.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Other Visa Options</h2>
                    <Link to="/visa-services" className="text-secondary font-medium flex items-center gap-1 hover:underline">
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedVisas.map((relatedVisa) => (
                      <Link 
                        key={relatedVisa.id} 
                        to={`/visa-services/${relatedVisa.slug}`}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {relatedVisa.is_express && (
                                <Zap className="w-4 h-4 text-amber-500" />
                              )}
                              <Badge variant="outline" className="text-xs">
                                {relatedVisa.visa_type}
                              </Badge>
                            </div>
                            <h3 className="font-semibold group-hover:text-secondary transition-colors mb-2">
                              {relatedVisa.title}
                            </h3>
                            <p className="text-secondary font-bold">
                              AED {relatedVisa.price}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
            {/* Sidebar - Application Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      {hasDiscount && (
                        <p className="text-muted-foreground line-through text-sm">
                          AED {visa.original_price}
                        </p>
                      )}
                      <div className="text-4xl font-bold text-secondary">
                        AED {visa.price}
                      </div>
                      <p className="text-muted-foreground text-sm">per person</p>
                    </div>
                    
                    {/* Trust Badges */}
                    <div className="space-y-2 py-4 border-y mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-secondary" />
                        <span>100% Secure Process</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{visa.processing_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>99% Approval Rate</span>
                      </div>
                    </div>
                    
                    {/* WhatsApp CTA */}
                    <Button
                      size="lg"
                      className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                      onClick={() => {
                        const message = encodeURIComponent(`Hi! I'm interested in the ${visa.title}`);
                        window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Quick Enquiry on WhatsApp
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Application Form */}
                <VisaApplicationForm visa={visa} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VisaServiceDetail;
