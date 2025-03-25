
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/types';

// Récupérer tous les plans d'abonnement actifs
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');
    
    if (error) {
      console.error("Erreur lors de la récupération des plans d'abonnement:", error);
      throw error;
    }
    
    // Transformer les dates en objets Date
    return data.map(plan => ({
      ...plan,
      created_at: new Date(plan.created_at),
      updated_at: new Date(plan.updated_at)
    }));
  } catch (error) {
    console.error("Erreur inattendue lors de la récupération des plans d'abonnement:", error);
    return [];
  }
};

// Récupérer un plan d'abonnement par son code
export const fetchSubscriptionPlanByCode = async (code: string): Promise<SubscriptionPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du plan d'abonnement ${code}:`, error);
      return null;
    }
    
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du plan d'abonnement ${code}:`, error);
    return null;
  }
};

// Abonner un client à un plan
export const createSubscription = async (clientId: string, freelancerId: string, planId: string, startDate: Date) => {
  try {
    // Récupérer d'abord les détails du plan
    const { data: planData, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (planError) {
      throw planError;
    }
    
    // Créer l'abonnement
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        name: `Abonnement ${planData.name}`,
        description: planData.description,
        price: planData.price,
        interval: planData.interval,
        clientId,
        freelancerId,
        status: 'active',
        startDate: startDate.toISOString(),
        // Calculer la date de renouvellement en fonction de l'intervalle
        renewalDate: calculateRenewalDate(startDate, planData.interval).toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la création de l'abonnement:", error);
    throw error;
  }
};

// Fonction utilitaire pour calculer la date de renouvellement
const calculateRenewalDate = (startDate: Date, interval: string): Date => {
  const date = new Date(startDate);
  
  switch (interval) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1); // Par défaut mensuel
  }
  
  return date;
};
