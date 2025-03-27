
import { supabase } from '@/lib/supabase';
import { SubscriptionInterval, SubscriptionPlan, SubscriptionStatus } from '@/types';

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*');

    if (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }

    // Convertir les données pour correspondre au type SubscriptionPlan
    return data.map(plan => ({
      id: plan.id,
      name: plan.name,
      code: plan.code,
      description: plan.description,
      price: Number(plan.price),
      interval: plan.interval as SubscriptionInterval,
      features: plan.features,
      isActive: plan.is_active, // Convertir is_active en isActive
      created_at: plan.created_at,
      updated_at: plan.updated_at
    }));
  } catch (error) {
    console.error('Unexpected error fetching subscription plans:', error);
    return [];
  }
}

export async function createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan | null> {
  try {
    // Convertir isActive en is_active pour la base de données
    const planData = {
      name: plan.name,
      code: plan.code,
      description: plan.description,
      price: plan.price,
      interval: plan.interval,
      features: plan.features,
      is_active: plan.isActive // Convertir isActive en is_active
    };

    const { data, error } = await supabase
      .from('subscription_plans')
      .insert([planData])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription plan:', error);
      return null;
    }

    // Convertir le résultat pour correspondre au type SubscriptionPlan
    return {
      id: data.id,
      name: data.name,
      code: data.code,
      description: data.description,
      price: Number(data.price),
      interval: data.interval as SubscriptionInterval,
      features: data.features,
      isActive: data.is_active, // Convertir is_active en isActive
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Unexpected error creating subscription plan:', error);
    return null;
  }
}

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
          isActive: plan.is_active,
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
    
    create: async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean, id?: string }> => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert(planData)
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
    
    update: async (id: string, planData: Partial<SubscriptionPlan>): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('subscription_plans')
          .update(planData)
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
    
    delete: async (id: string): Promise<boolean> => {
      try {
        // Suppression logique
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
