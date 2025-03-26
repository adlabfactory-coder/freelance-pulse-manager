
import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { SubscriptionPlan, SubscriptionStatus, SubscriptionInterval, Subscription } from '@/types';

// Service pour les abonnements avec Supabase
export const createSubscriptionsService = (supabaseClient: SupabaseClient<Database>) => {
  return {
    getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
      try {
        const { data, error } = await supabaseClient
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
    },
    
    getSubscriptionById: async (id: string): Promise<Subscription | null> => {
      try {
        const { data, error } = await supabaseClient
          .from('subscriptions')
          .select(`
            *,
            client:clientId(id, name, email),
            freelancer:freelancerId(id, name, email)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error(`Erreur lors de la récupération de l'abonnement ${id}:`, error);
          return null;
        }

        return {
          id: data.id,
          name: data.name,
          description: data.description || '',
          price: data.price,
          interval: data.interval as SubscriptionInterval,
          clientId: data.clientId,
          clientName: data.client ? data.client.name : 'Client inconnu',
          freelancerId: data.freelancerId,
          freelancerName: data.freelancer ? data.freelancer.name : 'Freelance inconnu',
          status: data.status as SubscriptionStatus,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          renewalDate: data.renewalDate ? new Date(data.renewalDate) : undefined,
        };
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'abonnement ${id}:`, error);
        return null;
      }
    },
    
    getSubscriptionsByFreelancer: async (freelancerId: string): Promise<Subscription[]> => {
      try {
        const { data, error } = await supabaseClient
          .from('subscriptions')
          .select(`
            *,
            client:clientId(id, name, email)
          `)
          .eq('freelancerId', freelancerId)
          .is('deleted_at', null)
          .order('startDate', { ascending: false });

        if (error) {
          console.error(`Erreur lors de la récupération des abonnements du freelance ${freelancerId}:`, error);
          return [];
        }

        return data.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description || '',
          price: sub.price,
          interval: sub.interval as SubscriptionInterval,
          clientId: sub.clientId,
          clientName: sub.client ? sub.client.name : 'Client inconnu',
          freelancerId: sub.freelancerId,
          status: sub.status as SubscriptionStatus,
          startDate: new Date(sub.startDate),
          endDate: sub.endDate ? new Date(sub.endDate) : undefined,
          renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : undefined,
        }));
      } catch (error) {
        console.error(`Erreur lors de la récupération des abonnements du freelance ${freelancerId}:`, error);
        return [];
      }
    },
    
    getAllSubscriptions: async (): Promise<Subscription[]> => {
      try {
        const { data, error } = await supabaseClient
          .from('subscriptions')
          .select(`
            *,
            client:clientId(id, name, email),
            freelancer:freelancerId(id, name, email)
          `)
          .is('deleted_at', null)
          .order('startDate', { ascending: false });

        if (error) {
          console.error('Erreur lors de la récupération des abonnements:', error);
          return [];
        }

        return data.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description || '',
          price: sub.price,
          interval: sub.interval as SubscriptionInterval,
          clientId: sub.clientId,
          clientName: sub.client ? sub.client.name : 'Client inconnu',
          freelancerId: sub.freelancerId,
          freelancerName: sub.freelancer ? sub.freelancer.name : 'Freelance inconnu',
          status: sub.status as SubscriptionStatus,
          startDate: new Date(sub.startDate),
          endDate: sub.endDate ? new Date(sub.endDate) : undefined,
          renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : undefined,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnements:', error);
        return [];
      }
    },
    
    createSubscription: async (subscription: Omit<Subscription, 'id'>): Promise<string | null> => {
      try {
        const { data, error } = await supabaseClient
          .from('subscriptions')
          .insert({
            name: subscription.name,
            description: subscription.description,
            price: subscription.price,
            interval: subscription.interval,
            clientId: subscription.clientId,
            freelancerId: subscription.freelancerId,
            status: subscription.status,
            startDate: subscription.startDate.toISOString(),
            endDate: subscription.endDate ? subscription.endDate.toISOString() : null,
            renewalDate: subscription.renewalDate ? subscription.renewalDate.toISOString() : null,
          })
          .select('id')
          .single();

        if (error) {
          console.error('Erreur lors de la création de l\'abonnement:', error);
          return null;
        }

        return data.id;
      } catch (error) {
        console.error('Erreur lors de la création de l\'abonnement:', error);
        return null;
      }
    },
    
    updateSubscription: async (id: string, updates: Partial<Omit<Subscription, 'id'>>): Promise<boolean> => {
      try {
        const updateData: any = {};
        
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.price !== undefined) updateData.price = updates.price;
        if (updates.interval !== undefined) updateData.interval = updates.interval;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.startDate !== undefined) updateData.startDate = updates.startDate.toISOString();
        if (updates.endDate !== undefined) updateData.endDate = updates.endDate ? updates.endDate.toISOString() : null;
        if (updates.renewalDate !== undefined) updateData.renewalDate = updates.renewalDate ? updates.renewalDate.toISOString() : null;
        
        updateData.updatedAt = new Date().toISOString();
        
        const { error } = await supabaseClient
          .from('subscriptions')
          .update(updateData)
          .eq('id', id);

        if (error) {
          console.error(`Erreur lors de la mise à jour de l'abonnement ${id}:`, error);
          return false;
        }

        return true;
      } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'abonnement ${id}:`, error);
        return false;
      }
    },
    
    softDeleteSubscription: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          console.error(`Erreur lors de la suppression de l'abonnement ${id}:`, error);
          return false;
        }

        return true;
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'abonnement ${id}:`, error);
        return false;
      }
    }
  };
};

// Export d'une instance du service avec le client Supabase par défaut
export const subscriptionsService = createSubscriptionsService(supabase);

// Export des fonctions individuelles pour faciliter l'utilisation
export const getSubscriptionPlans = () => subscriptionsService.getSubscriptionPlans();
export const getSubscriptionById = (id: string) => subscriptionsService.getSubscriptionById(id);
export const getSubscriptionsByFreelancer = (freelancerId: string) => subscriptionsService.getSubscriptionsByFreelancer(freelancerId);
export const getAllSubscriptions = () => subscriptionsService.getAllSubscriptions();
export const createSubscription = (subscription: Omit<Subscription, 'id'>) => subscriptionsService.createSubscription(subscription);
export const updateSubscription = (id: string, updates: Partial<Omit<Subscription, 'id'>>) => subscriptionsService.updateSubscription(id, updates);
export const softDeleteSubscription = (id: string) => subscriptionsService.softDeleteSubscription(id);
