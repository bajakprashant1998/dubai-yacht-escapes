import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useVisaService } from "@/hooks/useVisaServices";
import VisaRequirements from "@/components/visa/VisaRequirements";
import VisaApplicationForm from "@/components/visa/VisaApplicationForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, Clock, FileText, Zap } from "lucide-react";

const VisaServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: visa, isLoading, error } = useVisaService(slug || "");
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-5xl">
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
      <div className="min-h-screen pt-32 pb-16">
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <Link
            to="/visa-services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Visa Services
          </Link>
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
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
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{visa.title}</h1>
            <p className="text-muted-foreground">{visa.visa_type}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4">
                {visa.duration_days && (
                  <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{visa.duration_days} Days</p>
                    </div>
                  </div>
                )}
                {visa.validity && (
                  <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Validity</p>
                      <p className="font-medium">{visa.validity}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Processing</p>
                    <p className="font-medium">{visa.processing_time}</p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              {visa.long_description && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">About This Visa</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{visa.long_description}</p>
                </section>
              )}
              
              {/* Requirements */}
              <VisaRequirements visa={visa} />
              
              {/* FAQs */}
              {visa.faqs.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {visa.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}
            </div>
            
            {/* Application Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
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