import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Subscription, SubscriptionInterval, SubscriptionStatus, SubscriptionPlan } from '@/types/subscription';

/**
 * Service pour la gestion des abonnements
 */
export const createSubscriptionsService = (supabase: SupabaseClient<Database>) => {
  /**
   * Récupérer tous les abonnements
   */
  const fetchSubscriptions = async (): Promise<Subscription[]> => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*');

      if (error) throw error;
      return data as Subscription[];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  };

  /**
   * Récupérer un abonnement par ID
   */
  const fetchSubscriptionById = async (id: string): Promise<Subscription | null> => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Subscription | null;
    } catch (error) {
      console.error('Error fetching subscription by ID:', error);
      return null;
    }
  };

  /**
   * Créer un nouvel abonnement
   */
  const createSubscription = async (data: Omit<Subscription, 'id'>) => {
    try {
    // Convert date objects to ISO strings
    const startDate = typeof data.startDate === 'string' 
      ? data.startDate 
      : data.startDate.toISOString();
      
    const endDate = data.endDate 
      ? (typeof data.endDate === 'string' ? data.endDate : data.endDate.toISOString())
      : null;
      
    const renewalDate = data.renewalDate
      ? (typeof data.renewalDate === 'string' ? data.renewalDate : data.renewalDate.toISOString())
      : null;

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval,
        start_date: startDate,
        end_date: endDate,
        renewal_date: renewalDate,
        status: data.status,
        client_id: data.clientId,
        freelancer_id: data.freelancerId
      })
      .select()
      .single();

    if (error) throw error;
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

  /**
   * Mettre à jour un abonnement
   */
  const updateSubscription = async (id: string, data: Partial<Subscription>) => {
    try {
    const updateData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      interval: data.interval,
      status: data.status,
      client_id: data.clientId,
      freelancer_id: data.freelancerId
    };

    // Convert dates if they exist
    if (data.startDate) {
      updateData.start_date = typeof data.startDate === 'string' ? data.startDate : data.startDate.toISOString();
    }
    if (data.endDate) {
      updateData.end_date = typeof data.endDate === 'string' ? data.endDate : data.endDate.toISOString();
    }
    if (data.renewalDate) {
      updateData.renewal_date = typeof data.renewalDate === 'string' ? data.renewalDate : data.renewalDate.toISOString();
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data: updatedSubscription, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

  /**
   * Supprimer un abonnement
   */
  const deleteSubscription = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  };

  return {
    fetchSubscriptions,
    fetchSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription
  };
};
