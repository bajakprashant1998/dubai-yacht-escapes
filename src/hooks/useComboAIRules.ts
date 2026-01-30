import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ComboAIRule {
  id: string;
  rule_name: string;
  conditions: {
    trip_days_max?: number;
    trip_days_min?: number;
    travel_style?: string;
    budget_tier?: string;
    has_children?: boolean;
    nationality?: string;
  };
  combo_id: string;
  priority: number;
  max_discount_percent: number;
  upsell_combos: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComboAIRuleInput {
  rule_name: string;
  conditions: ComboAIRule["conditions"];
  combo_id: string;
  priority?: number;
  max_discount_percent?: number;
  upsell_combos?: string[];
  is_active?: boolean;
}

// Fetch all AI rules
export const useComboAIRules = () => {
  return useQuery({
    queryKey: ["combo-ai-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combo_ai_rules")
        .select("*")
        .order("priority", { ascending: false });

      if (error) throw error;
      return data as ComboAIRule[];
    },
  });
};

// Create AI rule
export const useCreateComboAIRule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: ComboAIRuleInput) => {
      const { data, error } = await supabase
        .from("combo_ai_rules")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as ComboAIRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-ai-rules"] });
      toast({
        title: "AI Rule Created",
        description: "The AI suggestion rule has been created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update AI rule
export const useUpdateComboAIRule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...input }: ComboAIRuleInput & { id: string }) => {
      const { data, error } = await supabase
        .from("combo_ai_rules")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ComboAIRule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-ai-rules"] });
      toast({
        title: "AI Rule Updated",
        description: "The AI suggestion rule has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete AI rule
export const useDeleteComboAIRule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("combo_ai_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-ai-rules"] });
      toast({
        title: "AI Rule Deleted",
        description: "The AI suggestion rule has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Match combo based on trip preferences (query-based for automatic matching)
export interface MatchComboParams {
  tripDays: number;
  travelStyle: string;
  budgetTier: string;
  hasChildren: boolean;
  nationality?: string;
}

export const useMatchCombo = (params: MatchComboParams) => {
  return useQuery({
    queryKey: ["combo-match", params],
    queryFn: async () => {
      // Only run if we have meaningful params
      if (params.tripDays <= 0) return null;

      // Fetch active rules sorted by priority
      const { data: rules, error: rulesError } = await supabase
        .from("combo_ai_rules")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (rulesError) {
        console.error("Error fetching AI rules:", rulesError);
        throw rulesError;
      }

      if (!rules || rules.length === 0) {
        console.log("No active AI rules found");
        return null;
      }

      // Find matching rule
      for (const rule of rules) {
        const conditions = rule.conditions as ComboAIRule["conditions"];
        let matches = true;
        let matchReasons: string[] = [];

        // Check trip days range
        if (conditions.trip_days_max !== undefined && conditions.trip_days_max > 0) {
          if (params.tripDays > conditions.trip_days_max) {
            matches = false;
          } else {
            matchReasons.push(`days <= ${conditions.trip_days_max}`);
          }
        }
        
        if (conditions.trip_days_min !== undefined && conditions.trip_days_min > 0) {
          if (params.tripDays < conditions.trip_days_min) {
            matches = false;
          } else {
            matchReasons.push(`days >= ${conditions.trip_days_min}`);
          }
        }

        // Check travel style (case-insensitive)
        if (conditions.travel_style && conditions.travel_style.trim() !== "") {
          const conditionStyle = conditions.travel_style.toLowerCase();
          const paramStyle = params.travelStyle.toLowerCase();
          if (conditionStyle !== paramStyle) {
            matches = false;
          } else {
            matchReasons.push(`style = ${conditions.travel_style}`);
          }
        }

        // Check budget tier (case-insensitive)
        if (conditions.budget_tier && conditions.budget_tier.trim() !== "") {
          const conditionBudget = conditions.budget_tier.toLowerCase();
          const paramBudget = params.budgetTier.toLowerCase();
          if (conditionBudget !== paramBudget) {
            matches = false;
          } else {
            matchReasons.push(`budget = ${conditions.budget_tier}`);
          }
        }

        // Check has children
        if (conditions.has_children === true && params.hasChildren !== true) {
          matches = false;
        } else if (conditions.has_children === true) {
          matchReasons.push("has children");
        }

        if (matches) {
          // Fetch the combo package separately
          const { data: combo, error: comboError } = await supabase
            .from("combo_packages")
            .select("*")
            .eq("id", rule.combo_id)
            .eq("is_active", true)
            .single();

          if (comboError) {
            console.error("Error fetching combo package:", comboError);
            continue;
          }

          if (combo) {
            console.log("Matched rule:", rule.rule_name, "with reasons:", matchReasons.join(", "));
            return {
              combo,
              rule,
            };
          }
        }
      }

      console.log("No matching rules found for params:", params);
      return null;
    },
    enabled: params.tripDays > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
};
