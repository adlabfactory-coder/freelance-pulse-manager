import { supabase } from "@/lib/supabase-client";
import { Subscription, SubscriptionPlan, SubscriptionStatus, SubscriptionInterval } from "@/types";

export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
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
};

export const fetchSubscriptions = async (userId?: string): Promise<Subscription[]> => {
  try {
    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        clients:clientId(name),
        freelancers:freelancerId(name)
      `);
    
    if (userId) {
      // Si un ID est fourni, filtrer soit par freelancerId soit par clientId
      query = query.or(`freelancerId.eq.${userId},clientId.eq.${userId}`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
    
    return data.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      price: Number(sub.price),
      interval: sub.interval as SubscriptionInterval,
      clientId: sub.clientId,
      clientName: sub.clients?.name,
      freelancerId: sub.freelancerId,
      freelancerName: sub.freelancers?.name,
      status: sub.status as SubscriptionStatus,
      startDate: new Date(sub.startDate),
      endDate: sub.endDate ? new Date(sub.endDate) : null,
      renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : null,
      createdAt: sub.createdAt ? new Date(sub.createdAt) : undefined,
      updatedAt: sub.updatedAt ? new Date(sub.updatedAt) : undefined
    }));
  } catch (error) {
    console.error('Unexpected error fetching subscriptions:', error);
    return [];
  }
};

export const fetchSubscriptionById = async (id: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients:clientId(name),
        freelancers:freelancerId(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching subscription with ID ${id}:`, error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      interval: data.interval as SubscriptionInterval,
      clientId: data.clientId,
      clientName: data.clients?.name,
      freelancerId: data.freelancerId,
      freelancerName: data.freelancers?.name,
      status: data.status as SubscriptionStatus,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      renewalDate: data.renewalDate ? new Date(data.renewalDate) : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
    };
  } catch (error) {
    console.error(`Unexpected error fetching subscription with ID ${id}:`, error);
    return null;
  }
};

export const createSubscription = async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean, id?: string }> => {
  try {
    // Préparer les données pour l'insertion
    const insertData = {
      name: subscriptionData.name,
      description: subscriptionData.description,
      price: subscriptionData.price,
      interval: subscriptionData.interval,
      clientId: subscriptionData.clientId,
      freelancerId: subscriptionData.freelancerId,
      status: subscriptionData.status,
      startDate: subscriptionData.startDate.toISOString(),
      endDate: subscriptionData.endDate ? subscriptionData.endDate.toISOString() : null,
      renewalDate: subscriptionData.renewalDate ? subscriptionData.renewalDate.toISOString() : null
    };
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(insertData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating subscription:', error);
      return { success: false };
    }
    
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Unexpected error creating subscription:', error);
    return { success: false };
  }
};

export const updateSubscription = async (id: string, subscriptionData: Partial<Subscription>): Promise<boolean> => {
  try {
    // Préparer les données pour la mise à jour
    const updateData: any = { ...subscriptionData };
    
    // Convertir les dates en chaînes ISO
    if (updateData.startDate instanceof Date) {
      updateData.startDate = updateData.startDate.toISOString();
    }
    if (updateData.endDate instanceof Date) {
      updateData.endDate = updateData.endDate.toISOString();
    }
    if (updateData.renewalDate instanceof Date) {
      updateData.renewalDate = updateData.renewalDate.toISOString();
    }
    
    // Supprimer les propriétés qui ne sont pas des colonnes de la table
    delete updateData.clientName;
    delete updateData.freelancerName;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const { error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating subscription with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error updating subscription with ID ${id}:`, error);
    return false;
  }
};

export const cancelSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: SubscriptionStatus.CANCELLED,
        endDate: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Error cancelling subscription with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error cancelling subscription with ID ${id}:`, error);
    return false;
  }
};

export const renewSubscription = async (id: string, newEndDate: Date): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: SubscriptionStatus.ACTIVE,
        endDate: newEndDate.toISOString(),
        renewalDate: null
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Error renewing subscription with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error renewing subscription with ID ${id}:`, error);
    return false;
  }
};

export const deleteSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting subscription with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting subscription with ID ${id}:`, error);
    return false;
  }
};
