
import { supabase } from "@/lib/supabase-client";
import { SubscriptionPlan, SubscriptionInterval } from "@/types/subscription";

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
      code: plan.code,
      created_at: plan.created_at ? new Date(plan.created_at) : undefined,
      updated_at: plan.updated_at ? new Date(plan.updated_at) : undefined
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
      code: data.code,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined
    };
  } catch (error) {
    console.error('Unexpected error fetching subscription plan:', error);
    return null;
  }
};

/**
 * Create a new subscription plan
 */
export const createSubscriptionPlan = async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; id?: string; error?: string }> => {
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

/**
 * Update an existing subscription plan
 */
export const updateSubscriptionPlan = async (id: string, plan: Partial<Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (plan.name !== undefined) updateData.name = plan.name;
    if (plan.description !== undefined) updateData.description = plan.description;
    if (plan.interval !== undefined) updateData.interval = plan.interval;
    if (plan.price !== undefined) updateData.price = plan.price;
    if (plan.isActive !== undefined) updateData.is_active = plan.isActive;
    if (plan.code !== undefined) updateData.code = plan.code;
    if (plan.features !== undefined) updateData.features = plan.features;
    
    const { error } = await supabase
      .from('subscription_plans')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la mise à jour du plan d'abonnement ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du plan d'abonnement ${id}:`, error);
    return false;
  }
};

/**
 * Delete a subscription plan
 */
export const deleteSubscriptionPlan = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression du plan d'abonnement ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du plan d'abonnement ${id}:`, error);
    return false;
  }
};
