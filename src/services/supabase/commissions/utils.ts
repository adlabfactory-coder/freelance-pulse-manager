
import { CommissionTier } from '@/types/commissions';
import { CommissionDbRecord, CommissionRuleDbRecord } from './types';

/**
 * Convertit une valeur de niveau de commission de la base de données en enum TypeScript
 */
export function mapTierFromDb(dbTier: string): CommissionTier {
  switch(dbTier) {
    case 'bronze':
      return CommissionTier.TIER_1;
    case 'silver':
      return CommissionTier.TIER_2;
    case 'gold':
      return CommissionTier.TIER_3;
    case 'platinum':
      return CommissionTier.TIER_4;
    default:
      return CommissionTier.TIER_1;
  }
}

/**
 * Convertit un enum TypeScript de niveau de commission en valeur pour la base de données
 */
export function mapTierToDb(tier: CommissionTier): string {
  switch(tier) {
    case CommissionTier.TIER_1:
      return 'bronze';
    case CommissionTier.TIER_2:
      return 'silver';
    case CommissionTier.TIER_3:
      return 'gold';
    case CommissionTier.TIER_4:
      return 'platinum';
    default:
      return 'bronze';
  }
}

/**
 * Convertit un enregistrement de règle de commission de la base de données en objet métier
 */
export function mapCommissionRuleFromDb(rule: CommissionRuleDbRecord) {
  return {
    id: rule.id,
    tier: mapTierFromDb(rule.tier),
    minContracts: rule.minContracts,
    maxContracts: rule.maxContracts || null,
    percentage: rule.percentage,
    amount: rule.amount || null,
  };
}

/**
 * Convertit un enregistrement de commission de la base de données en objet métier
 */
export function mapCommissionFromDb(item: CommissionDbRecord) {
  return {
    id: item.id,
    freelancerId: item.freelancerId,
    freelancerName: item.freelancer?.name || "Freelancer inconnu",
    amount: item.amount,
    tier: mapTierFromDb(item.tier),
    periodStart: new Date(item.periodStart),
    periodEnd: new Date(item.periodEnd),
    status: item.status as any,
    paidDate: item.paidDate ? new Date(item.paidDate) : undefined,
    paymentRequested: item.payment_requested || false,
    period: `${new Date(item.periodStart).toLocaleDateString()} - ${new Date(item.periodEnd).toLocaleDateString()}`
  };
}

/**
 * Renvoie des règles de commission par défaut en cas d'erreur ou d'absence de données
 */
export function getDefaultCommissionRules() {
  return [
    {
      id: "default-tier-1",
      tier: CommissionTier.TIER_1,
      minContracts: 0,
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
}
