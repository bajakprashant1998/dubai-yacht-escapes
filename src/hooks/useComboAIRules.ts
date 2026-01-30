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

// Match combo based on trip preferences
export const useMatchCombo = () => {
  return useMutation({
    mutationFn: async (preferences: {
      trip_days: number;
      travel_style: string;
      budget_tier: string;
      has_children: boolean;
      nationality?: string;
    }) => {
      // Fetch active rules sorted by priority
      const { data: rules, error } = await supabase
        .from("combo_ai_rules")
        .select("*, combo:combo_packages(*)")
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (error) throw error;

      // Find matching rule
      for (const rule of rules || []) {
        const conditions = rule.conditions as ComboAIRule["conditions"];
        let matches = true;

        if (conditions.trip_days_max && preferences.trip_days > conditions.trip_days_max) {
          matches = false;
        }
        if (conditions.trip_days_min && preferences.trip_days < conditions.trip_days_min) {
          matches = false;
        }
        if (conditions.travel_style && conditions.travel_style !== preferences.travel_style) {
          matches = false;
        }
        if (conditions.budget_tier && conditions.budget_tier !== preferences.budget_tier) {
          matches = false;
        }
        if (conditions.has_children !== undefined && conditions.has_children !== preferences.has_children) {
          matches = false;
        }

        if (matches && rule.combo) {
          return {
            combo: rule.combo,
            rule,
          };
        }
      }

      return null;
    },
  });
};
