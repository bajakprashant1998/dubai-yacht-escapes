import { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
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
  const { generateTrip, isGenerating } = useTripPlanner();
  
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
        navigate(`/trip/${result.tripId}`);
      }
    } catch (error) {
      console.error('Failed to generate trip:', error);
    }
  };

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
            className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden"
          >
            {/* Enhanced Step Indicators */}
            <div className="px-4 md:px-8 py-6 border-b bg-gradient-to-r from-muted/30 to-muted/10">
              <div className="flex items-center justify-between gap-2">
                {stepInfo.map((info, index) => {
                  const stepNum = index + 1;
                  const Icon = info.icon;
                  const isCompleted = stepNum < step;
                  const isCurrent = stepNum === step;
                  
                  return (
                    <div key={stepNum} className="flex items-center flex-1">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.1 : 1,
                        }}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className={cn(
                            'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative',
                            isCompleted
                              ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30'
                              : isCurrent
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                          {isCurrent && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute inset-0 rounded-xl border-2 border-primary"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] md:text-xs font-medium hidden sm:block",
                          isCurrent ? "text-primary" : isCompleted ? "text-secondary" : "text-muted-foreground"
                        )}>
                          {info.title}
                        </span>
                      </motion.div>
                      
                      {index < 4 && (
                        <div className={cn(
                          "flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300",
                          stepNum < step ? "bg-secondary" : "bg-muted"
                        )} />
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20"
                      >
                        <span className="text-2xl font-bold text-secondary">{totalDays}</span>
                        <span className="text-muted-foreground ml-2">{totalDays === 1 ? 'day' : 'days'} in Dubai</span>
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
            <div className="px-6 md:px-10 py-6 border-t bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-between">
              <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </motion.div>

              {step < 5 ? (
                <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2 px-6 h-11"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !canProceed()}
                    className="gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground px-8 h-12 text-base shadow-lg shadow-secondary/30"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Your Trip...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My Trip
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
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
                className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50"
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
