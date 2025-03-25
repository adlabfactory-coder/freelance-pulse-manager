
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, SubscriptionInterval } from '@/types';

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
    
    // Transformer les données et convertir l'intervalle en SubscriptionInterval
    return data.map(plan => ({
      ...plan,
      interval: mapToSubscriptionInterval(plan.interval),
      features: parseFeatures(plan.features),
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
      interval: mapToSubscriptionInterval(data.interval),
      features: parseFeatures(data.features),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération du plan d'abonnement ${code}:`, error);
    return null;
  }
};

// Fonction utilitaire pour mapper une chaîne d'intervalle à SubscriptionInterval
function mapToSubscriptionInterval(interval: string): SubscriptionInterval {
  switch (interval.toLowerCase()) {
    case 'monthly':
      return SubscriptionInterval.MONTHLY;
    case 'quarterly':
      return SubscriptionInterval.QUARTERLY;
    case 'yearly':
      return SubscriptionInterval.YEARLY;
    default:
      // Par défaut, on utilise l'intervalle mensuel
      return SubscriptionInterval.MONTHLY;
  }
}

// Fonction utilitaire pour parser les features JSON
function parseFeatures(jsonFeatures: any): { website: boolean; social_media: boolean; features: string[] } {
  if (!jsonFeatures) {
    return { website: false, social_media: false, features: [] };
  }
  
  let features;
  
  try {
    // Si jsonFeatures est une chaîne, on tente de la parser
    if (typeof jsonFeatures === 'string') {
      features = JSON.parse(jsonFeatures);
    } else {
      // Sinon on utilise l'objet directement
      features = jsonFeatures;
    }
    
    return {
      website: features.website || false,
      social_media: features.social_media || false,
      features: Array.isArray(features.features) ? features.features : []
    };
  } catch (error) {
    console.error("Erreur lors du parsing des features:", error);
    return { website: false, social_media: false, features: [] };
  }
}

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
