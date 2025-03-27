
import { supabase } from "@/lib/supabase-client";
import { Subscription, SubscriptionStatus, SubscriptionInterval } from "@/types";
import { User } from "@/types";

/**
 * Fetch subscriptions for a specific client
 */
export const fetchClientSubscriptions = async (clientId: string): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, clients:clientId(*), freelancers:freelancerId(*)')
      .eq('clientId', clientId)
      .is('deleted_at', null)
      .order('startDate', { ascending: false });

    if (error) {
      console.error('Error fetching client subscriptions:', error);
      return [];
    }

    return mapSubscriptions(data);
  } catch (error) {
    console.error('Unexpected error fetching client subscriptions:', error);
    return [];
  }
};

/**
 * Fetch subscriptions managed by a specific freelancer
 */
export const fetchFreelancerSubscriptions = async (freelancerId: string): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, clients:clientId(*)')
      .eq('freelancerId', freelancerId)
      .is('deleted_at', null)
      .order('startDate', { ascending: false });

    if (error) {
      console.error('Error fetching freelancer subscriptions:', error);
      return [];
    }

    return mapSubscriptions(data);
  } catch (error) {
    console.error('Unexpected error fetching freelancer subscriptions:', error);
    return [];
  }
};

/**
 * Fetch all subscriptions (admin only)
 */
export const fetchAllSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, clients:contacts!subscriptions_clientId_fkey(*), freelancers:users!subscriptions_freelancerId_fkey(*)')
      .is('deleted_at', null)
      .order('startDate', { ascending: false });

    if (error) {
      console.error('Error fetching all subscriptions:', error);
      return [];
    }

    // Mock data for development - remove in production when DB is fully set up
    if (!data || data.length === 0) {
      return getMockSubscriptions();
    }

    return mapSubscriptions(data);
  } catch (error) {
    console.error('Unexpected error fetching all subscriptions:', error);
    // Return mock data for now
    return getMockSubscriptions();
  }
};

/**
 * Fetch a subscription by its ID
 */
export const fetchSubscriptionById = async (id: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, clients:clientId(*), freelancers:freelancerId(*)')
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
      interval: data.interval as SubscriptionInterval,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      renewalDate: data.renewalDate ? new Date(data.renewalDate) : undefined,
      status: data.status as SubscriptionStatus,
      clientId: data.clientId,
      freelancerId: data.freelancerId,
      clientName: data.clients?.name,
      freelancerName: data.freelancers?.name
    };
  } catch (error) {
    console.error('Unexpected error fetching subscription:', error);
    return null;
  }
};

// Helper function to map subscription data from the database to the application model
const mapSubscriptions = (data: any[]): Subscription[] => {
  return data.map(sub => ({
    id: sub.id,
    name: sub.name,
    description: sub.description || '',
    price: sub.price,
    interval: sub.interval as SubscriptionInterval,
    startDate: new Date(sub.startDate),
    endDate: sub.endDate ? new Date(sub.endDate) : undefined,
    renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : undefined,
    status: sub.status as SubscriptionStatus,
    clientId: sub.clientId,
    freelancerId: sub.freelancerId,
    clientName: sub.clients?.name,
    freelancerName: sub.freelancers?.name
  }));
};

// Mock data for development - remove in production
const getMockSubscriptions = (): Subscription[] => {
  return [
    {
      id: '1',
      name: 'Plan Basique',
      description: 'Plan basique pour petites entreprises',
      price: 49.99,
      interval: SubscriptionInterval.MONTHLY,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2023-12-15'),
      renewalDate: new Date('2023-12-15'),
      status: SubscriptionStatus.ACTIVE,
      clientId: '101',
      freelancerId: '201',
      clientName: 'Entreprise ABC',
      freelancerName: 'Jean Dupont'
    },
    {
      id: '2',
      name: 'Plan Pro',
      description: 'Plan pour entreprises de taille moyenne',
      price: 199.99,
      interval: SubscriptionInterval.YEARLY,
      startDate: new Date('2023-02-20'),
      status: SubscriptionStatus.PENDING,
      clientId: '102',
      freelancerId: '202',
      clientName: 'Société XYZ',
      freelancerName: 'Marie Martin'
    }
  ];
};
