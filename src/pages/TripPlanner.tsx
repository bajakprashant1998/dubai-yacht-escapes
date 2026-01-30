import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Plane, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        {/* Hero Section */}
        <div className="relative py-16 md:py-24 text-center">
          <div className="container max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Trip Planning
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Plan Your Perfect Dubai Trip
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us a little about your trip, and our AI will create a complete, personalized itinerary in seconds.
            </p>

            {/* Currency Selector in header */}
            <div className="mt-6 flex justify-center">
              <CurrencySelector />
            </div>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="container max-w-3xl pb-20">
          <div className="bg-card rounded-3xl shadow-2xl border overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-muted">
              <div
                className="h-full bg-secondary transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="px-6 py-4 border-b flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Step {step} of 5
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                      s < step
                        ? 'bg-secondary text-secondary-foreground'
                        : s === step
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 md:p-10">
              {/* Step 1: Dates */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Plane className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">When are you traveling?</h2>
                    <p className="text-muted-foreground mt-2">
                      Select your arrival and departure dates
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Arrival Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Arrival Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal h-12',
                              !arrivalDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {arrivalDate ? format(arrivalDate, 'PPP') : 'Select date'}
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
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Departure Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Departure Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal h-12',
                              !departureDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departureDate ? format(departureDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            disabled={(date) => date < (arrivalDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {totalDays > 0 && (
                    <p className="text-center text-secondary font-medium">
                      {totalDays} {totalDays === 1 ? 'day' : 'days'} in Dubai
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Travelers */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Who's traveling?</h2>
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
                </div>
              )}

              {/* Step 3: Nationality */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">What's your nationality?</h2>
                    <p className="text-muted-foreground mt-2">
                      We'll check visa requirements for you
                    </p>
                  </div>

                  <NationalitySelector
                    value={nationality}
                    onChange={setNationality}
                  />
                </div>
              )}

              {/* Step 4: Budget */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">What's your budget preference?</h2>
                    <p className="text-muted-foreground mt-2">
                      This helps us recommend the right experiences
                    </p>
                  </div>

                  <BudgetSelector
                    value={budgetTier}
                    onChange={setBudgetTier}
                  />
                </div>
              )}

              {/* Step 5: Travel Style & Occasion */}
              {step === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Almost done!</h2>
                    <p className="text-muted-foreground mt-2">
                      What kind of experience are you looking for?
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Travel Style</label>
                      <TravelStyleSelector
                        value={travelStyle}
                        onChange={setTravelStyle}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Special Occasion?</label>
                      <SpecialOccasionSelector
                        value={specialOccasion}
                        onChange={setSpecialOccasion}
                      />
                    </div>
                  </div>

                  {/* AI Combo Suggestion */}
                  {matchedCombo && showComboSuggestion && (
                    <ComboSuggestion
                      combo={matchedCombo.combo}
                      onDismiss={() => setShowComboSuggestion(false)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 md:px-10 py-6 border-t bg-muted/30 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>

              {step < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !canProceed()}
                  className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Your Trip...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate My Trip
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              AI-Powered Planning
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              Best Price Guaranteed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripPlanner;
