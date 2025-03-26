
import { CommissionStatus, CommissionTier } from "@/types/commissions";

/**
 * Obtient le libellé pour un niveau de commission
 * @param tier - Le niveau de commission
 * @returns Le libellé du niveau de commission
 */
export const getTierLabel = (tier: CommissionTier): string => {
  switch (tier) {
    case CommissionTier.TIER_1:
      return "Moins de 10 contrats";
    case CommissionTier.TIER_2:
      return "11 à 20 contrats";
    case CommissionTier.TIER_3:
      return "21 à 30 contrats";
    case CommissionTier.TIER_4:
      return "31 contrats et plus";
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
  return date.toLocaleDateString("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

/**
 * Formate un montant en devise
 * @param amount - Montant à formater
 * @returns Montant formaté
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calcule le montant de commission en fonction du niveau
 * @param amount - Montant de base
 * @param tier - Niveau de commission
 * @returns Montant de commission calculé
 */
export const calculateCommissionAmount = (amount: number, tier: CommissionTier): number => {
  const baseAmounts: Record<CommissionTier, number> = {
    [CommissionTier.TIER_1]: 500,   // Moins de 10 contrats
    [CommissionTier.TIER_2]: 1000,  // 11 à 20 contrats
    [CommissionTier.TIER_3]: 1500,  // 21 à 30 contrats
    [CommissionTier.TIER_4]: 2000   // 31+ contrats
  };
  
  return amount * baseAmounts[tier];
};
