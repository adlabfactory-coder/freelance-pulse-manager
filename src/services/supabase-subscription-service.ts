
import { supabase } from "@/lib/supabase-client";
import { SubscriptionPlan, SubscriptionInterval, SubscriptionStatus } from "@/types";

export const createSubscriptionPlanService = () => {
  return {
    fetchAll: async (): Promise<SubscriptionPlan[]> => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching subscription plans:', error);
          throw error;
        }
        
        return data.map(plan => ({
          id: plan.id,
          name: plan.name,
          code: plan.code,
          description: plan.description,
          price: Number(plan.price),
          interval: plan.interval as SubscriptionInterval,
          features: plan.features,
          is_active: plan.is_active,
          created_at: plan.created_at,
          updated_at: plan.updated_at
        }));
      } catch (error) {
        console.error('Unexpected error fetching subscription plans:', error);
        return [];
      }
    },
    
    fetchById: async (id: string): Promise<SubscriptionPlan | null> => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error(`Error fetching subscription plan with ID ${id}:`, error);
          return null;
        }
        
        if (!data) return null;
        
        return {
          id: data.id,
          name: data.name,
          code: data.code,
          description: data.description,
          price: Number(data.price),
          interval: data.interval as SubscriptionInterval,
          features: data.features,
          is_active: data.is_active,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
      } catch (error) {
        console.error(`Unexpected error fetching subscription plan with ID ${id}:`, error);
        return null;
      }
    },
    
    // Autres méthodes selon les besoins...
  };
};
