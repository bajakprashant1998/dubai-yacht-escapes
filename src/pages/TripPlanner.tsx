import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Plane, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Users, 
  Globe2, 
  Wallet, 
  Heart,
  CheckCircle2,
  Mail,
  Phone,
  User
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import TravelerCounter from '@/components/trip/TravelerCounter';
import BudgetSelector from '@/components/trip/BudgetSelector';
import TravelStyleSelector from '@/components/trip/TravelStyleSelector';
import NationalitySelector from '@/components/trip/NationalitySelector';
import SpecialOccasionSelector from '@/components/trip/SpecialOccasionSelector';
import CurrencySelector from '@/components/trip/CurrencySelector';
import ComboSuggestion from '@/components/combo/ComboSuggestion';
import { useTripPlanner, TripInput } from '@/hooks/useTripPlanner';
import { useMatchCombo } from '@/hooks/useComboAIRules';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Step = 1 | 2 | 3 | 4 | 5;

const stepInfo = [
  { icon: CalendarIcon, title: 'Dates', description: 'When are you traveling?' },
  { icon: Users, title: 'Travelers', description: 'Who\'s coming along?' },
  { icon: Globe2, title: 'Nationality', description: 'Visa requirements' },
  { icon: Wallet, title: 'Budget', description: 'Your spending preference' },
  { icon: Heart, title: 'Style', description: 'Type of experience' },
];

const TripPlanner = () => {
  const navigate = useNavigate();
  const { generateTrip, isGenerating, error: tripError } = useTripPlanner();
  
  // Lead capture state
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [step, setStep] = useState<Step>(1);
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nationality, setNationality] = useState('');
  const [budgetTier, setBudgetTier] = useState<'low' | 'medium' | 'luxury'>('medium');
  const [travelStyle, setTravelStyle] = useState<'family' | 'couple' | 'adventure' | 'relax' | 'luxury'>('relax');
  const [specialOccasion, setSpecialOccasion] = useState<'none' | 'birthday' | 'honeymoon' | 'anniversary'>('none');
  const [showComboSuggestion, setShowComboSuggestion] = useState(true);
  const [arrivalCalendarOpen, setArrivalCalendarOpen] = useState(false);
  const [departureCalendarOpen, setDepartureCalendarOpen] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);

  const handleLeadSubmit = async () => {
    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadEmail.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubmittingLead(true);
    try {
      const { data, error } = await supabase
        .from('trip_leads')
        .insert({
          name: leadName.trim(),
          email: leadEmail.trim(),
          phone: leadPhone.trim() || null,
          notes: leadNotes.trim() || null,
        })
        .select('id')
        .single();
      if (error) throw error;
      setLeadId(data.id);
      setLeadCaptured(true);
      toast.success('Welcome! Let\'s plan your trip.');
    } catch (err) {
      console.error('Lead submission error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Calculate total days for matching
  const totalDays = arrivalDate && departureDate
    ? Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Match combo based on user preferences
  const { data: matchedCombo, isLoading: isMatchingCombo } = useMatchCombo({
    tripDays: totalDays,
    budgetTier,
    travelStyle,
    hasChildren: children > 0,
  });

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!arrivalDate && !!departureDate;
      case 2:
        return adults > 0;
      case 3:
        return !!nationality;
      case 4:
        return !!budgetTier;
      case 5:
        return !!travelStyle;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  // Generating steps animation
  const generatingSteps = [
    'Analyzing your preferences...',
    'Finding the best hotels...',
    'Curating activities & tours...',
    'Optimizing your schedule...',
    'Finalizing your itinerary...',
  ];

  useEffect(() => {
    if (!isGenerating) {
      setGeneratingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setGeneratingStep(prev => (prev + 1) % generatingSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!arrivalDate || !departureDate || !nationality) return;

    const input: TripInput = {
      arrivalDate: format(arrivalDate, 'yyyy-MM-dd'),
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      adults,
      children,
      nationality,
      budgetTier,
      travelStyle,
      specialOccasion: specialOccasion === 'none' ? undefined : specialOccasion,
    };

    try {
      const result = await generateTrip(input);
      if (result?.tripId) {
        // Link lead to the generated trip
        if (leadId) {
          await supabase.from('trip_leads').update({ trip_id: result.tripId, status: 'generated' }).eq('id', leadId);
        }
        navigate(`/trip/${result.tripId}`);
      }
    } catch (error) {
      console.error('Failed to generate trip:', error);
    }
  };

  // Full-screen generating overlay
  if (isGenerating) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 relative z-10 max-w-md px-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-xl shadow-secondary/30"
            >
              <Sparkles className="w-10 h-10 text-secondary-foreground" />
            </motion.div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Creating Your Trip</h2>
              <AnimatePresence mode="wait">
                <motion.p
                  key={generatingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-muted-foreground text-lg"
                >
                  {generatingSteps[generatingStep]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                initial={{ width: '5%' }}
                animate={{ width: '90%' }}
                transition={{ duration: 20, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground">This usually takes 10-15 seconds</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Lead capture form
  if (!leadCaptured) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="relative py-12 md:py-20 text-center">
            <div className="container max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-primary/20 text-secondary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-secondary/20"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                AI-Powered Trip Planning
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4"
              >
                Plan Your Perfect Dubai Trip
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Share your details to get started — our AI will craft a personalized itinerary just for you.
              </motion.p>
            </div>
          </div>

          <div className="container max-w-lg pb-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-secondary/30">
                  <User className="w-7 h-7 text-secondary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Get Started</h2>
                <p className="text-sm text-muted-foreground">Tell us how to reach you so we can share your trip plan</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleLeadSubmit(); }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10 h-12 rounded-xl"
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 h-12 rounded-xl"
                      maxLength={255}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="pl-10 h-12 rounded-xl"
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Requests <span className="text-muted-foreground">(optional)</span></label>
                  <Input
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    placeholder="E.g., honeymoon, wheelchair access..."
                    className="h-12 rounded-xl"
                    maxLength={500}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingLead || !leadName.trim() || !leadEmail.trim() || !leadPhone.trim()}
                  className="w-full h-12 rounded-xl text-base font-semibold"
                  size="lg"
                >
                  {isSubmittingLead ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <>Continue to Plan My Trip <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Your information is secure and will only be used to assist with your trip planning.
              </p>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <div className="relative py-12 md:py-20 text-center">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-primary/20 text-secondary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-secondary/20"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI-Powered Trip Planning
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4"
            >
              Plan Your Perfect Dubai Trip
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Tell us a little about your trip, and our AI will create a complete, personalized itinerary in seconds.
            </motion.p>

            {/* Currency Selector in header */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex justify-center"
            >
              <CurrencySelector variant="default" />
            </motion.div>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="container max-w-4xl pb-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card backdrop-blur-xl rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Enhanced Step Indicators */}
            <div className="px-4 md:px-8 py-5 border-b border-border/50 bg-muted/20">
              <div className="flex items-center justify-between">
                {stepInfo.map((info, index) => {
                  const stepNum = index + 1;
                  const Icon = info.icon;
                  const isCompleted = stepNum < step;
                  const isCurrent = stepNum === step;
                  
                  return (
                    <div key={stepNum} className="flex items-center flex-1">
                      <button
                        type="button"
                        onClick={() => { if (isCompleted) setStep(stepNum as Step); }}
                        className={cn(
                          "flex flex-col items-center gap-1.5 group",
                          isCompleted && "cursor-pointer"
                        )}
                        disabled={!isCompleted && !isCurrent}
                        aria-label={`Step ${stepNum}: ${info.title}`}
                      >
                        <motion.div
                          initial={false}
                          animate={{ scale: isCurrent ? 1.05 : 1 }}
                          className={cn(
                            'w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300',
                            isCompleted
                              ? 'bg-secondary text-secondary-foreground shadow-md shadow-secondary/20 group-hover:shadow-lg'
                              : isCurrent
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-2 ring-primary/30 ring-offset-2 ring-offset-card'
                              : 'bg-muted/60 text-muted-foreground/50'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4.5 h-4.5" />
                          ) : (
                            <Icon className="w-4.5 h-4.5" />
                          )}
                        </motion.div>
                        <div className="hidden sm:flex flex-col items-center">
                          <span className={cn(
                            "text-[11px] font-semibold tracking-wide",
                            isCurrent ? "text-primary" : isCompleted ? "text-secondary" : "text-muted-foreground/50"
                          )}>
                            {info.title}
                          </span>
                        </div>
                      </button>
                      
                      {index < 4 && (
                        <div className="flex-1 mx-1.5 md:mx-3">
                          <div className={cn(
                            "h-[2px] rounded-full transition-all duration-500",
                            stepNum < step ? "bg-secondary" : "bg-border/50"
                          )} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 md:p-10 min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Dates */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary/30"
                      >
                        <Plane className="w-8 h-8 text-secondary-foreground" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-bold">When are you traveling?</h2>
                      <p className="text-muted-foreground mt-2">
                        Select your arrival and departure dates
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Arrival Date */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-medium text-muted-foreground">Arrival Date</label>
                        <Popover open={arrivalCalendarOpen} onOpenChange={setArrivalCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal h-14 rounded-xl border-2 hover:border-primary/50 transition-all',
                                !arrivalDate && 'text-muted-foreground',
                                arrivalDate && 'border-primary/30 bg-primary/5'
                              )}
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">From</span>
                                <span className="font-medium">{arrivalDate ? format(arrivalDate, 'PPP') : 'Select date'}</span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={arrivalDate}
                              onSelect={(date) => {
                                setArrivalDate(date);
                                if (date && (!departureDate || departureDate < date)) {
                                  setDepartureDate(addDays(date, 4));
                                }
                                setArrivalCalendarOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>

                      {/* Departure Date */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="text-sm font-medium text-muted-foreground">Departure Date</label>
                        <Popover open={departureCalendarOpen} onOpenChange={setDepartureCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal h-14 rounded-xl border-2 hover:border-primary/50 transition-all',
                                !departureDate && 'text-muted-foreground',
                                departureDate && 'border-primary/30 bg-primary/5'
                              )}
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="text-xs text-muted-foreground">Until</span>
                                <span className="font-medium">{departureDate ? format(departureDate, 'PPP') : 'Select date'}</span>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={departureDate}
                              onSelect={(date) => {
                                setDepartureDate(date);
                                setDepartureCalendarOpen(false);
                              }}
                              disabled={(date) => date < (arrivalDate || new Date())}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                    </div>

                    {totalDays > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 py-3"
                      >
                        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-5 py-2.5 rounded-full border border-secondary/20">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="font-bold text-lg">{totalDays}</span>
                          <span className="text-sm font-medium">{totalDays === 1 ? 'day' : 'days'} in Dubai</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Travelers */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
                      >
                        <Users className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-bold">Who's traveling?</h2>
                      <p className="text-muted-foreground mt-2">
                        Tell us about your travel party
                      </p>
                    </div>

                    <TravelerCounter
                      adults={adults}
                      children={children}
                      onAdultsChange={setAdults}
                      onChildrenChange={setChildren}
                    />
                  </motion.div>
                )}

                {/* Step 3: Nationality */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30"
                      >
                        <Globe2 className="w-8 h-8 text-accent-foreground" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-bold">What's your nationality?</h2>
                      <p className="text-muted-foreground mt-2">
                        We'll check visa requirements for you
                      </p>
                    </div>

                    <NationalitySelector
                      value={nationality}
                      onChange={setNationality}
                    />
                  </motion.div>
                )}

                {/* Step 4: Budget */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30"
                      >
                        <Wallet className="w-8 h-8 text-accent-foreground" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-bold">What's your budget preference?</h2>
                      <p className="text-muted-foreground mt-2">
                        This helps us recommend the right experiences
                      </p>
                    </div>

                    <BudgetSelector
                      value={budgetTier}
                      onChange={setBudgetTier}
                    />
                  </motion.div>
                )}

                {/* Step 5: Travel Style & Occasion */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-destructive/80 to-destructive/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-destructive/30"
                      >
                        <Heart className="w-8 h-8 text-destructive-foreground" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-bold">Almost done!</h2>
                      <p className="text-muted-foreground mt-2">
                        What kind of experience are you looking for?
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-3 block text-muted-foreground">Travel Style</label>
                        <TravelStyleSelector
                          value={travelStyle}
                          onChange={setTravelStyle}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block text-muted-foreground">Special Occasion?</label>
                        <SpecialOccasionSelector
                          value={specialOccasion}
                          onChange={setSpecialOccasion}
                        />
                      </div>
                    </div>

                    {/* AI Combo Suggestion */}
                    {matchedCombo && showComboSuggestion && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <ComboSuggestion
                          combo={matchedCombo.combo}
                          onDismiss={() => setShowComboSuggestion(false)}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-6 md:px-10 py-5 border-t border-border/50 space-y-3">
              {tripError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive flex items-center gap-2"
                >
                  <span className="shrink-0">⚠️</span>
                  <span className="flex-1">{tripError}</span>
                  <Button variant="ghost" size="sm" onClick={handleGenerate} className="text-destructive hover:text-destructive shrink-0">
                    Retry
                  </Button>
                </motion.div>
              )}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {step < 5 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2 px-8 h-11 rounded-xl shadow-sm"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={!canProceed()}
                    className="gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground px-8 h-12 text-base rounded-xl shadow-lg shadow-secondary/30"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate My Trip
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8"
          >
            {[
              { label: 'AI-Powered Planning', icon: Sparkles },
              { label: 'Best Price Guaranteed', icon: CheckCircle2 },
              { label: '24/7 Support', icon: Heart },
            ].map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-full border border-border"
              >
                <badge.icon className="w-4 h-4 text-secondary" />
                {badge.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TripPlanner;
