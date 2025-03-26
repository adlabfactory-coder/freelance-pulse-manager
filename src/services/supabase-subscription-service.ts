import { SubscriptionPlan, SubscriptionInterval, SubscriptionStatus } from '@/types';

// Fonction pour récupérer les plans d'abonnement
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  // Pour la démo, retourner des données fictives
  return [
    {
      id: '1',
      name: 'Plan Essentiel',
      description: 'Pour les petites entreprises',
      interval: SubscriptionInterval.MONTHLY,
      features: {
        website: true,
        social_media: true,
        features: ['Site Web', 'Gestion réseaux sociaux', 'Support 5/7']
      },
      created_at: new Date(),
      updated_at: new Date(),
      code: 'ESSENTIAL',
      isActive: true,
      price: 199
    },
    {
      id: '2',
      name: 'Plan Professionnel',
      description: 'Pour les entreprises en croissance',
      interval: SubscriptionInterval.MONTHLY,
      features: {
        website: true,
        social_media: true,
        features: ['Site Web Premium', 'Gestion réseaux sociaux avancée', 'Support 7/7', 'Référencement SEO', 'Campagnes publicitaires']
      },
      created_at: new Date(),
      updated_at: new Date(),
      code: 'PRO',
      isActive: true,
      price: 399
    },
    {
      id: '3',
      name: 'Plan Entreprise',
      description: 'Solution complète pour grandes entreprises',
      interval: SubscriptionInterval.MONTHLY,
      features: {
        website: true,
        social_media: true,
        features: ['Site Web Sur Mesure', 'Stratégie marketing complète', 'Support dédié 24/7', 'Référencement SEO avancé', 'Campagnes publicitaires optimisées', 'Analyse de données']
      },
      created_at: new Date(),
      updated_at: new Date(),
      code: 'ENTERPRISE',
      isActive: true,
      price: 899
    },
    {
      id: '4',
      name: 'Plan Annuel',
      description: '2 mois offerts sur le plan Professionnel',
      interval: SubscriptionInterval.ANNUAL,
      features: {
        website: true,
        social_media: true,
        features: ['Site Web Premium', 'Gestion réseaux sociaux avancée', 'Support 7/7', 'Référencement SEO', 'Campagnes publicitaires', 'Audit annuel']
      },
      created_at: new Date(),
      updated_at: new Date(),
      code: 'YEARLY',
      isActive: true,
      price: 3990
    }
  ] as SubscriptionPlan[];
};

// Fonction pour récupérer un plan d'abonnement spécifique
export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
  const plans = await getSubscriptionPlans();
  return plans.find(plan => plan.id === id) || null;
};
