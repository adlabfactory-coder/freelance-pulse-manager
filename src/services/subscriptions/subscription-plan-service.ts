
import { supabase } from "@/lib/supabase-client";
import { SubscriptionPlan, SubscriptionInterval } from "@/types";

/**
 * Fetch all subscription plans
 */
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }

    // Transform database data to the application model
    return data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      interval: plan.interval as SubscriptionInterval,
      features: plan.features || [], 
      isActive: plan.is_active,
      code: plan.code
    }));
  } catch (error) {
    console.error('Unexpected error fetching subscription plans:', error);
    return [];
  }
};

/**
 * Fetch a subscription plan by its ID
 */
export const fetchSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching subscription plan:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      interval: data.interval as SubscriptionInterval,
      features: data.features || [],
      isActive: data.is_active,
      code: data.code
    };
  } catch (error) {
    console.error('Unexpected error fetching subscription plan:', error);
    return null;
  }
};

/**
 * Create a new subscription plan
 */
export const createSubscriptionPlan = async (plan: Omit<SubscriptionPlan, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval,
        features: plan.features || [],
        is_active: plan.isActive !== undefined ? plan.isActive : true,
        code: plan.code
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Une erreur est survenue' };
  }
};
