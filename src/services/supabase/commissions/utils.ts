
import { Commission, CommissionRule, CommissionTier } from '@/types/commissions';
import { UserRole } from '@/types';

/**
 * Convertit un tier de commission en format de base de données
 * @param tier - Tier de commission de l'énumération
 * @returns - Chaîne compatible avec la base de données
 */
export const mapTierToDb = (tier: CommissionTier): string => {
  switch (tier) {
    case CommissionTier.TIER_1: return 'bronze';
    case CommissionTier.TIER_2: return 'silver';
    case CommissionTier.TIER_3: return 'gold';
    case CommissionTier.TIER_4: return 'platinum';
    default: return 'bronze';
  }
};

/**
 * Convertit un tier de la base de données en énumération CommissionTier
 * @param dbTier - Tier stocké en base de données
 * @returns - Valeur de l'énumération CommissionTier
 */
export const mapTierFromDb = (dbTier: string): CommissionTier => {
  switch (dbTier) {
    case 'bronze': return CommissionTier.TIER_1;
    case 'silver': return CommissionTier.TIER_2;
    case 'gold': return CommissionTier.TIER_3;
    case 'platinum': return CommissionTier.TIER_4;
    default: return CommissionTier.TIER_1;
  }
};

/**
 * Mappe une commission depuis la base de données vers le format de l'application
 */
export const mapCommissionFromDb = (dbCommission: any): Commission => {
  return {
    id: dbCommission.id,
    freelancerId: dbCommission.freelancerId,
    freelancerName: dbCommission.freelancer?.name || 'Freelance inconnu',
    amount: dbCommission.amount,
    tier: mapTierFromDb(dbCommission.tier),
    periodStart: new Date(dbCommission.periodStart),
    periodEnd: new Date(dbCommission.periodEnd),
    status: dbCommission.status,
    paidDate: dbCommission.paidDate ? new Date(dbCommission.paidDate) : undefined,
    paymentRequested: dbCommission.payment_requested || false,
    period: `${new Date(dbCommission.periodStart).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
  };
};

/**
 * Mappe une règle de commission depuis la base de données vers le format de l'application
 */
export const mapCommissionRuleFromDb = (dbRule: any): CommissionRule => {
  return {
    id: dbRule.id,
    tier: mapTierFromDb(dbRule.tier),
    minContracts: dbRule.minContracts,
    maxContracts: dbRule.maxContracts || null,
    percentage: dbRule.percentage,
    amount: dbRule.amount || undefined
  };
};

/**
 * Obtient les règles de commission par défaut
 */
export const getDefaultCommissionRules = (): CommissionRule[] => {
  return [
    {
      id: "default-tier-1",
      tier: CommissionTier.TIER_1,
      minContracts: 1,
      maxContracts: 10,
      percentage: 10,
      amount: 500
    },
    {
      id: "default-tier-2",
      tier: CommissionTier.TIER_2,
      minContracts: 11,
      maxContracts: 20,
      percentage: 15,
      amount: 1000
    },
    {
      id: "default-tier-3",
      tier: CommissionTier.TIER_3,
      minContracts: 21,
      maxContracts: 30,
      percentage: 20,
      amount: 1500
    },
    {
      id: "default-tier-4",
      tier: CommissionTier.TIER_4,
      minContracts: 31,
      percentage: 25,
      amount: 2000
    }
  ];
};

/**
 * Options pour le service de commissions
 */
export interface CommissionServiceOptions {
  enableNotifications?: boolean;
  defaultCurrency?: string;
}
