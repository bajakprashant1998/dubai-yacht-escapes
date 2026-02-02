import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Briefcase, Plane, Clock, ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface VisaFinderWizardProps {
  onComplete: (filters: { nationality: string; purpose: string; duration: string }) => void;
}

const purposes = [
  { id: "tourism", label: "Tourism", icon: Plane, description: "Sightseeing, vacation, visiting friends" },
  { id: "business", label: "Business", icon: Briefcase, description: "Meetings, conferences, work" },
  { id: "transit", label: "Transit", icon: Globe, description: "Connecting flights through UAE" },
];

const durations = [
  { id: "short", label: "14 Days", description: "Short trip" },
  { id: "medium", label: "30 Days", description: "Standard visit" },
  { id: "long", label: "60-90 Days", description: "Extended stay" },
  { id: "multi", label: "Multiple Entry", description: "Frequent visits" },
];

const popularCountries = [
  "India", "Pakistan", "Philippines", "Bangladesh", "United Kingdom", 
  "United States", "Russia", "China", "Nigeria", "Egypt"
];

const VisaFinderWizard = ({ onComplete }: VisaFinderWizardProps) => {
  const [step, setStep] = useState(0);
  const [nationality, setNationality] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setIsSearching(true);
      setTimeout(() => {
        onComplete({ nationality, purpose, duration });
        setIsSearching(false);
      }, 800);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 0) return nationality.length > 0;
    if (step === 1) return purpose.length > 0;
    if (step === 2) return duration.length > 0;
    return false;
  };

  const steps = [
    { title: "Nationality", description: "Where are you from?" },
    { title: "Purpose", description: "Why are you visiting?" },
    { title: "Duration", description: "How long will you stay?" },
  ];

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-muted/30">
      <CardContent className="p-0">
        {/* Progress Steps */}
        <div className="bg-primary/5 px-6 py-4 border-b">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  i < step ? "bg-secondary text-secondary-foreground" :
                  i === step ? "bg-secondary text-secondary-foreground ring-4 ring-secondary/20" :
                  "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-1 mx-2 rounded-full transition-all duration-300",
                    i < step ? "bg-secondary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 md:p-8 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{steps[step].description}</h3>
                <p className="text-muted-foreground">Step {step + 1} of 3</p>
              </div>

              {/* Step 0: Nationality */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="relative max-w-md mx-auto">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter your nationality..."
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="pl-12 h-14 text-lg rounded-xl border-2 focus:border-secondary"
                    />
                  </div>
                  <div className="max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground mb-3">Popular countries:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => setNationality(country)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-all",
                            nationality === country
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          )}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Purpose */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {purposes.map((p) => (
                    <motion.button
                      key={p.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPurpose(p.id)}
                      className={cn(
                        "p-6 rounded-2xl border-2 text-left transition-all duration-200",
                        purpose === p.id
                          ? "border-secondary bg-secondary/10 shadow-lg"
                          : "border-border hover:border-secondary/50 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                        purpose === p.id ? "bg-secondary text-secondary-foreground" : "bg-muted"
                      )}>
                        <p.icon className="w-7 h-7" />
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{p.label}</h4>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 2: Duration */}
              {step === 2 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {durations.map((d) => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDuration(d.id)}
                      className={cn(
                        "p-5 rounded-2xl border-2 text-center transition-all duration-200",
                        duration === d.id
                          ? "border-secondary bg-secondary/10 shadow-lg"
                          : "border-border hover:border-secondary/50 hover:bg-muted/50"
                      )}
                    >
                      <Clock className={cn(
                        "w-8 h-8 mx-auto mb-3 transition-colors",
                        duration === d.id ? "text-secondary" : "text-muted-foreground"
                      )} />
                      <h4 className="font-semibold mb-1">{d.label}</h4>
                      <p className="text-xs text-muted-foreground">{d.description}</p>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-muted/30 border-t flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSearching}
            className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground min-w-[140px]"
          >
            {isSearching ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                Finding...
              </>
            ) : step === 2 ? (
              <>
                Find My Visa
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisaFinderWizard;
