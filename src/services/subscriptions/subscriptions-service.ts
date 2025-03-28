
import { supabase } from '@/lib/supabase-client';
import { Subscription, SubscriptionStatus } from '@/types/subscription';

// Get a single subscription by ID
export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data as Subscription;
  } catch (error) {
    console.error('Exception while fetching subscription:', error);
    return null;
  }
};

// Get all subscriptions
export const getAllSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .is('deleted_at', null)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }

    return data as Subscription[];
  } catch (error) {
    console.error('Exception while fetching subscriptions:', error);
    return [];
  }
};

// Create a new subscription
export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        ...subscription,
        createdAt: new Date(),
        updatedAt: new Date()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }

    return data as Subscription;
  } catch (error) {
    console.error('Exception while creating subscription:', error);
    return null;
  }
};

// Update an existing subscription
export const updateSubscription = async (id: string, subscription: Partial<Subscription>): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        ...subscription,
        updatedAt: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return null;
    }

    return data as Subscription;
  } catch (error) {
    console.error('Exception while updating subscription:', error);
    return null;
  }
};

// Cancel a subscription
export const cancelSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: SubscriptionStatus.CANCELLED,
        endDate: new Date(),
        updatedAt: new Date()
      })
      .eq('id', id);

    if (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception while cancelling subscription:', error);
    return false;
  }
};

// Renew a subscription
export const renewSubscription = async (id: string, months: number = 1): Promise<Subscription | null> => {
  try {
    // First, get the current subscription
    const { data: currentSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentSubscription) {
      console.error('Error fetching subscription for renewal:', fetchError);
      return null;
    }

    // Calculate new renewal date (1 month from now)
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + months);

    // Update subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        renewalDate,
        status: SubscriptionStatus.ACTIVE,
        updatedAt: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error renewing subscription:', error);
      return null;
    }

    return data as Subscription;
  } catch (error) {
    console.error('Exception while renewing subscription:', error);
    return null;
  }
};

// Soft delete a subscription
export const deleteSubscription = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        deleted_at: new Date(),
        updatedAt: new Date()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception while deleting subscription:', error);
    return false;
  }
};

// Helper function to ensure date is properly handled
export const ensureDate = (date: string | Date): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};
