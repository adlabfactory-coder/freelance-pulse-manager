
import { supabase } from '@/lib/supabase-client';
import { Subscription, SubscriptionStatus } from '@/types/subscription';
import { toast } from 'sonner';

/**
 * Fetch all subscriptions
 */
export const fetchAllSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients:contacts(name),
        freelancers:users(name)
      `)
      .is('deleted_at', null)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }

    // Transform database data to the application model
    return data.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description || '',
      price: sub.price,
      interval: sub.interval,
      startDate: new Date(sub.startDate),
      endDate: sub.endDate ? new Date(sub.endDate) : undefined,
      renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : undefined,
      status: sub.status as SubscriptionStatus,
      clientId: sub.clientId,
      freelancerId: sub.freelancerId,
      // Extract names from relations
      clientName: sub.clients?.name || 'Client inconnu',
      freelancerName: sub.freelancers?.name || 'Freelancer inconnu'
    }));
  } catch (error) {
    console.error('Unexpected error fetching subscriptions:', error);
    return [];
  }
};

/**
 * Fetch a subscription by its ID
 */
export const fetchSubscriptionById = async (id: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        clients:contacts(name),
        freelancers:users(name)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      interval: data.interval,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      renewalDate: data.renewalDate ? new Date(data.renewalDate) : undefined,
      status: data.status as SubscriptionStatus,
      clientId: data.clientId,
      freelancerId: data.freelancerId,
      // Extract names from relations
      clientName: data.clients?.name || 'Client inconnu',
      freelancerName: data.freelancers?.name || 'Freelancer inconnu'
    };
  } catch (error) {
    console.error('Unexpected error fetching subscription:', error);
    return null;
  }
};

/**
 * Create a new subscription
 */
export const createSubscription = async (
  subscription: Omit<Subscription, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        name: subscription.name,
        description: subscription.description,
        price: subscription.price,
        interval: subscription.interval,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate?.toISOString(),
        renewalDate: subscription.renewalDate?.toISOString(),
        status: subscription.status,
        clientId: subscription.clientId,
        freelancerId: subscription.freelancerId
      })
      .select()
      .single();

    if (error) {
      toast.error(`Erreur: ${error.message}`);
      return { success: false, error: error.message };
    }

    toast.success('Abonnement créé avec succès');
    return { success: true, id: data.id };
  } catch (error: any) {
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return { success: false, error: error.message || 'Une erreur est survenue' };
  }
};

/**
 * Update an existing subscription
 */
export const updateSubscription = async (
  id: string,
  updates: Partial<Omit<Subscription, 'id'>>
): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.interval !== undefined) updateData.interval = updates.interval;
    if (updates.startDate !== undefined) updateData.startDate = updates.startDate.toISOString();
    if (updates.endDate !== undefined) updateData.endDate = updates.endDate.toISOString();
    if (updates.renewalDate !== undefined) updateData.renewalDate = updates.renewalDate.toISOString();
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.clientId !== undefined) updateData.clientId = updates.clientId;
    if (updates.freelancerId !== undefined) updateData.freelancerId = updates.freelancerId;
    
    updateData.updatedAt = new Date().toISOString();
    
    const { error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast.error(`Erreur: ${error.message}`);
      return false;
    }

    toast.success('Abonnement mis à jour avec succès');
    return true;
  } catch (error: any) {
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return false;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: SubscriptionStatus.CANCELLED,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error(`Erreur: ${error.message}`);
      return false;
    }

    toast.success('Abonnement annulé avec succès');
    return true;
  } catch (error: any) {
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return false;
  }
};

/**
 * Renew a subscription
 */
export const renewSubscription = async (id: string, newEndDate: Date): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: SubscriptionStatus.ACTIVE,
        endDate: newEndDate.toISOString(),
        renewalDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error(`Erreur: ${error.message}`);
      return false;
    }

    toast.success('Abonnement renouvelé avec succès');
    return true;
  } catch (error: any) {
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return false;
  }
};

/**
 * Delete a subscription (logical delete)
 */
export const deleteSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error(`Erreur: ${error.message}`);
      return false;
    }

    toast.success('Abonnement supprimé avec succès');
    return true;
  } catch (error: any) {
    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    return false;
  }
};
