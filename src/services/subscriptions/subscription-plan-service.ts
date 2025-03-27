
import { supabase } from '@/lib/supabase';
import { SubscriptionInterval, SubscriptionPlan } from '@/types';

/**
 * Factory for creating subscription plan service
 */
export const createSubscriptionPlanService = () => {
  return {
    /**
     * Fetch all active subscription plans
     */
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
          isActive: plan.is_active,
          created_at: plan.created_at,
          updated_at: plan.updated_at
        }));
      } catch (error) {
        console.error('Unexpected error fetching subscription plans:', error);
        return [];
      }
    },
    
    /**
     * Fetch a subscription plan by ID
     */
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
          isActive: data.is_active,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
      } catch (error) {
        console.error(`Unexpected error fetching subscription plan with ID ${id}:`, error);
        return null;
      }
    },
    
    /**
     * Create a new subscription plan
     */
    create: async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, id?: string }> => {
      try {
        // Convert isActive to is_active for database
        const dbPlanData = {
          name: planData.name,
          code: planData.code,
          description: planData.description,
          price: planData.price,
          interval: planData.interval,
          features: planData.features,
          is_active: planData.isActive
        };
        
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert(dbPlanData)
          .select('id')
          .single();
        
        if (error) {
          console.error('Error creating subscription plan:', error);
          return { success: false };
        }
        
        return { success: true, id: data.id };
      } catch (error) {
        console.error('Unexpected error creating subscription plan:', error);
        return { success: false };
      }
    },
    
    /**
     * Update an existing subscription plan
     */
    update: async (id: string, planData: Partial<SubscriptionPlan>): Promise<boolean> => {
      try {
        // Convert isActive to is_active for database if it exists
        const dbPlanData: any = {...planData};
        
        if ('isActive' in planData) {
          dbPlanData.is_active = planData.isActive;
          delete dbPlanData.isActive;
        }
        
        const { error } = await supabase
          .from('subscription_plans')
          .update(dbPlanData)
          .eq('id', id);
        
        if (error) {
          console.error(`Error updating subscription plan with ID ${id}:`, error);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error(`Unexpected error updating subscription plan with ID ${id}:`, error);
        return false;
      }
    },
    
    /**
     * Soft delete a subscription plan by setting is_active to false
     */
    delete: async (id: string): Promise<boolean> => {
      try {
        // Logical deletion
        const { error } = await supabase
          .from('subscription_plans')
          .update({ is_active: false })
          .eq('id', id);
        
        if (error) {
          console.error(`Error deleting subscription plan with ID ${id}:`, error);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error(`Unexpected error deleting subscription plan with ID ${id}:`, error);
        return false;
      }
    }
  };
};
