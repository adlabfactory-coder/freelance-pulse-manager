import { supabase } from '@/lib/supabase-client';
import { SubscriptionPlan, SubscriptionStatus, SubscriptionInterval } from '@/types';

// Fonction pour récupérer tous les plans d'abonnement
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Erreur lors de la récupération des plans d\'abonnement:', error);
      return [];
    }

    return data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      interval: plan.interval as SubscriptionInterval,
      price: plan.price,
      isActive: plan.is_active,
      code: plan.code,
      features: plan.features,
      created_at: plan.created_at ? new Date(plan.created_at) : undefined,
      updated_at: plan.updated_at ? new Date(plan.updated_at) : undefined
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des plans d\'abonnement:', error);
    return [];
  }
};

// Fonction pour récupérer un plan d'abonnement par son ID
export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du plan d'abonnement ${id}:`, error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      interval: data.interval as SubscriptionInterval,
      price: data.price,
      isActive: data.is_active,
      code: data.code,
      features: data.features,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération du plan d'abonnement ${id}:`, error);
    return null;
  }
};

// Fonction pour créer un plan d'abonnement
export const createSubscriptionPlan = async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert({
        name: plan.name,
        description: plan.description,
        interval: plan.interval,
        price: plan.price,
        is_active: plan.isActive,
        code: plan.code,
        features: plan.features
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du plan d\'abonnement:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      interval: data.interval as SubscriptionInterval,
      price: plan.price,
      isActive: plan.is_active,
      code: plan.code,
      features: plan.features,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined
    };
  } catch (error) {
    console.error('Erreur lors de la création du plan d\'abonnement:', error);
    return null;
  }
};

// Fonction pour mettre à jour un plan d'abonnement
export const updateSubscriptionPlan = async (id: string, updates: Partial<Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.interval !== undefined) updateData.interval = updates.interval;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.code !== undefined) updateData.code = updates.code;
    if (updates.features !== undefined) updateData.features = updates.features;
    
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

// Fonction pour supprimer un plan d'abonnement
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
