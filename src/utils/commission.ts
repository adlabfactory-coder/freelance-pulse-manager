
import { CommissionStatus, CommissionTier } from "@/types/commissions";

/**
 * Obtient le libellé pour un niveau de commission
 * @param tier - Le niveau de commission
 * @returns Le libellé du niveau de commission
 */
export const getTierLabel = (tier: CommissionTier): string => {
  switch (tier) {
    case CommissionTier.TIER_1:
      return "Bronze (1-10 contrats)";
    case CommissionTier.TIER_2:
      return "Argent (11-20 contrats)";
    case CommissionTier.TIER_3:
      return "Or (21-30 contrats)";
    case CommissionTier.TIER_4:
      return "Platine (31+ contrats)";
    default:
      return "Inconnu";
  }
};

/**
 * Formate une période (dates de début et de fin)
 * @param startDate - Date de début
 * @param endDate - Date de fin
 * @returns Période formatée
 */
export const formatPeriod = (startDate: Date, endDate: Date): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Formate une date en format lisible
 * @param date - Date à formater
 * @returns Date formatée
 */
export const formatDate = (date: Date | undefined): string => {
  if (!date) return "N/A";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

/**
 * Formate un montant en devise
 * @param amount: number - Montant à formater
 * @returns Montant formaté
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calcule le montant de commission en fonction du niveau et du montant
 * @param amount - Montant de base
 * @param tier - Niveau de commission
 * @returns Montant de commission calculé
 */
export const calculateCommissionAmount = (amount: number, percentage: number): number => {
  return amount * (percentage / 100);
};

/**
 * Détermine le niveau de commission en fonction du nombre de contrats
 * @param contractsCount - Nombre de contrats
 * @param rules - Règles de commission
 * @returns Niveau de commission applicable
 */
export const determineCommissionTier = (contractsCount: number, rules: any[]): CommissionTier => {
  if (!rules || rules.length === 0) {
    return CommissionTier.TIER_1;
  }
  
  // Trier les règles par nombre minimum de contrats décroissant
  const sortedRules = [...rules].sort((a, b) => b.minContracts - a.minContracts);
  
  // Trouver la première règle qui s'applique
  for (const rule of sortedRules) {
    if (contractsCount >= rule.minContracts) {
      switch (rule.tier) {
        case 'bronze': return CommissionTier.TIER_1;
        case 'silver': return CommissionTier.TIER_2;
        case 'gold': return CommissionTier.TIER_3;
        case 'platinum': return CommissionTier.TIER_4;
        default: 
          if (rule.tier === CommissionTier.TIER_1) return CommissionTier.TIER_1;
          if (rule.tier === CommissionTier.TIER_2) return CommissionTier.TIER_2;
          if (rule.tier === CommissionTier.TIER_3) return CommissionTier.TIER_3;
          if (rule.tier === CommissionTier.TIER_4) return CommissionTier.TIER_4;
          return CommissionTier.TIER_1;
      }
    }
  }
  
  return CommissionTier.TIER_1;
};
