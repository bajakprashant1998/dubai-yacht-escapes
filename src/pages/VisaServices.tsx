import Layout from "@/components/layout/Layout";
import { useVisaServices } from "@/hooks/useVisaServices";
import VisaCard from "@/components/visa/VisaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

const VisaServices = () => {
  const { data: visas = [], isLoading } = useVisaServices();

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 pt-32 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <FileText className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">UAE Visa Services</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your UAE visa hassle-free. We offer tourist visas, express processing,
              and multiple entry options with fast turnaround times.
            </p>
          </div>
          
          {/* Visa Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : visas.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-lg">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No visa services available</h3>
              <p className="text-muted-foreground">
                Please check back later for available visa services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visas.map((visa) => (
                <VisaCard key={visa.id} visa={visa} />
              ))}
            </div>
          )}
          
          {/* Info Section */}
          <div className="mt-16 bg-background rounded-xl p-8 border">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Choose Visa", desc: "Select the visa type that suits your travel needs" },
                { step: 2, title: "Submit Documents", desc: "Upload required documents through our secure portal" },
                { step: 3, title: "Processing", desc: "We process your application with UAE authorities" },
                { step: 4, title: "Receive Visa", desc: "Get your e-visa delivered to your email" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-secondary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VisaServices;