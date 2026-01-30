import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VisaNationalityRule {
  id: string;
  country_code: string;
  country_name: string;
  visa_required: boolean;
  visa_on_arrival: boolean;
  recommended_visa_id: string | null;
  notes: string | null;
  documents_required: string[];
  is_active: boolean;
}

export const useVisaRules = (countryCode?: string) => {
  const { data: allRules = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['visa-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_nationality_rules')
        .select('*')
        .eq('is_active', true)
        .order('country_name');

      if (error) throw error;
      return data as VisaNationalityRule[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - visa rules don't change often
  });

  const { data: countryRule, isLoading: isLoadingCountry } = useQuery({
    queryKey: ['visa-rule', countryCode],
    queryFn: async () => {
      if (!countryCode) return null;

      const { data, error } = await supabase
        .from('visa_nationality_rules')
        .select('*')
        .eq('country_code', countryCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as VisaNationalityRule | null;
    },
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 60,
  });

  // Get country list for nationality selector
  const countries = allRules.map(rule => ({
    code: rule.country_code,
    name: rule.country_name,
    visaRequired: rule.visa_required,
  }));

  return {
    allRules,
    countryRule,
    countries,
    isLoading: isLoadingAll || isLoadingCountry,
    isVisaRequired: countryRule?.visa_required ?? true, // Default to required if unknown
    documentsRequired: countryRule?.documents_required ?? [],
    visaOnArrival: countryRule?.visa_on_arrival ?? false,
  };
};
