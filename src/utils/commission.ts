
import { CommissionStatus, CommissionTier, CommissionTierValues } from "@/types/commissions";

/**
 * Gets the label for a commission tier
 * @param tier - The commission tier
 * @returns The label for the commission tier
 */
export const getTierLabel = (tier: CommissionTier): string => {
  switch (tier) {
    case CommissionTierValues.BRONZE:
      return "Bronze (1-10 contrats)";
    case CommissionTierValues.SILVER:
      return "Argent (11-20 contrats)";
    case CommissionTierValues.GOLD:
      return "Or (21-30 contrats)";
    case CommissionTierValues.PLATINUM:
      return "Platine (31+ contrats)";
    default:
      return "Inconnu";
  }
};

/**
 * Formats a period (start and end dates)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted period
 */
export const formatPeriod = (startDate: Date, endDate: Date): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Formats a date in a readable format
 * @param date - Date to format
 * @returns Formatted date
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
 * Formats an amount as currency
 * @param amount: number - Amount to format
 * @returns Formatted amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculates a commission amount based on contract count and unit amount
 * @param contractsCount - Number of contracts
 * @param unitAmount - Unit amount per contract
 * @returns Calculated commission amount
 */
export const calculateCommissionAmount = (contractsCount: number, unitAmount: number): number => {
  return contractsCount * unitAmount;
};

/**
 * Determines the commission tier based on contract count
 * @param contractsCount - Number of contracts
 * @param rules - Commission rules
 * @returns Applicable commission tier
 */
export const determineCommissionTier = (contractsCount: number, rules: any[]): CommissionTier => {
  if (!rules || rules.length === 0) {
    return CommissionTierValues.BRONZE;
  }
  
  // Sort rules by minimum contract count in descending order
  const sortedRules = [...rules].sort((a, b) => b.minContracts - a.minContracts);
  
  // Find the first applicable rule
  for (const rule of sortedRules) {
    if (contractsCount >= rule.minContracts) {
      switch (rule.tier) {
        case 'bronze': return CommissionTierValues.BRONZE;
        case 'silver': return CommissionTierValues.SILVER;
        case 'gold': return CommissionTierValues.GOLD;
        case 'platinum': return CommissionTierValues.PLATINUM;
        default: 
          if (rule.tier === CommissionTierValues.BRONZE) return CommissionTierValues.BRONZE;
          if (rule.tier === CommissionTierValues.SILVER) return CommissionTierValues.SILVER;
          if (rule.tier === CommissionTierValues.GOLD) return CommissionTierValues.GOLD;
          if (rule.tier === CommissionTierValues.PLATINUM) return CommissionTierValues.PLATINUM;
          return CommissionTierValues.BRONZE;
      }
    }
  }
  
  return CommissionTierValues.BRONZE;
};
