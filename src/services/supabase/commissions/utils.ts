
import { supabase } from '@/lib/supabase-client';
import { Commission, CommissionRule, CommissionStatus, CommissionTier } from '@/types/commissions';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Récupère les commissions pour un utilisateur
 */
export const fetchCommissionsByUserId = async (userId: string): Promise<Commission[]> => {
  try {
    // Dans une implémentation réelle, nous ferions un appel à Supabase
    // Pour l'instant, retournons des données simulées
    const today = new Date();
    
    // Données simulées pour la démonstration
    return [
      {
        id: '1',
        freelancerId: userId,
        tier: 'gold',
        amount: 1250.00,
        status: 'paid' as CommissionStatus,
        periodStart: new Date(today.getFullYear(), today.getMonth() - 2, 1),
        periodEnd: new Date(today.getFullYear(), today.getMonth() - 2, 0),
        paidDate: new Date(today.getFullYear(), today.getMonth() - 1, 15),
        payment_requested: true,
        contracts_count: 15,
        createdAt: new Date(today.getFullYear(), today.getMonth() - 2, 28)
      },
      {
        id: '2',
        freelancerId: userId,
        tier: 'gold',
        amount: 1400.00,
        status: 'pending' as CommissionStatus,
        periodStart: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        periodEnd: new Date(today.getFullYear(), today.getMonth() - 1, 0),
        payment_requested: true,
        contracts_count: 16,
        createdAt: new Date(today.getFullYear(), today.getMonth() - 1, 28)
      },
      {
        id: '3',
        freelancerId: userId,
        tier: 'platinum',
        amount: 2300.00,
        status: 'pending' as CommissionStatus,
        periodStart: new Date(today.getFullYear(), today.getMonth(), 1),
        periodEnd: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        payment_requested: false,
        contracts_count: 23,
        createdAt: new Date()
      },
    ];
  } catch (error) {
    console.error('Erreur lors de la récupération des commissions:', error);
    return [];
  }
};

/**
 * Récupère tous les règles de commission
 */
export const fetchCommissionRules = async (): Promise<CommissionRule[]> => {
  try {
    // Dans une implémentation réelle, nous ferions un appel à Supabase
    // Pour l'instant, retournons des données simulées
    return [
      {
        id: '1',
        tier: 'bronze',
        percentage: 2,
        unit_amount: 0,
        minContracts: 1,
        maxContracts: 5
      },
      {
        id: '2',
        tier: 'silver',
        percentage: 3,
        unit_amount: 0,
        minContracts: 6,
        maxContracts: 10
      },
      {
        id: '3',
        tier: 'gold',
        percentage: 5,
        unit_amount: 100,
        minContracts: 11,
        maxContracts: 20
      },
      {
        id: '4',
        tier: 'platinum',
        percentage: 7,
        unit_amount: 250,
        minContracts: 21,
        maxContracts: 30
      },
      {
        id: '5',
        tier: 'diamond',
        percentage: 10,
        unit_amount: 500,
        minContracts: 31,
        maxContracts: null
      }
    ];
  } catch (error) {
    console.error('Erreur lors de la récupération des règles de commission:', error);
    return [];
  }
};

/**
 * Formatte la période d'une commission (ex: "Janvier 2023")
 */
export const formatCommissionPeriod = (commission: Commission): string => {
  if (!commission.periodStart || !commission.periodEnd) return '-';
  
  const start = new Date(commission.periodStart);
  
  // Formater avec date-fns
  return format(start, 'MMMM yyyy', { locale: fr });
};
