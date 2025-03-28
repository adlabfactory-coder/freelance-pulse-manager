
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CommissionTier, CommissionRule } from '@/types/commissions';

/**
 * Get the start and end dates of a month
 */
export const getMonthDates = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
};

/**
 * Get all days between two dates
 */
export const getDaysBetweenDates = (startDate: Date, endDate: Date) => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};

/**
 * Format date in a standardized way
 */
export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: fr });
};

/**
 * Format period (start-end) in a standardized way
 */
export const formatPeriod = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, 'MMMM yyyy', { locale: fr })}`;
};

/**
 * Determine commission tier based on contract count
 */
export const determineCommissionTier = (
  contractsCount: number,
  rules: CommissionRule[]
): CommissionTier => {
  // Sort rules by minContracts in ascending order
  const sortedRules = [...rules].sort((a, b) => a.minContracts - b.minContracts);
  
  // Find the appropriate tier based on contract count
  for (let i = sortedRules.length - 1; i >= 0; i--) {
    const rule = sortedRules[i];
    if (contractsCount >= rule.minContracts && 
        (rule.maxContracts === null || contractsCount <= rule.maxContracts)) {
      return rule.tier;
    }
  }
  
  // Default to the lowest tier if no match found
  return sortedRules[0]?.tier || 'bronze';
};

/**
 * Calculate commission amount based on tier and contract count
 */
export const calculateCommissionAmount = (
  contractsCount: number,
  tier: CommissionTier,
  rules: CommissionRule[]
): number => {
  const rule = rules.find(r => r.tier === tier);
  
  if (!rule) {
    return 0;
  }
  
  return rule.unit_amount * contractsCount;
};

/**
 * Get the display label for a tier
 */
export const getTierLabel = (tier: string): string => {
  if (!tier) return 'Bronze';
  
  // Normalize the tier
  const normalizedTier = typeof tier === 'string' ? tier.toLowerCase() : '';
  
  switch(normalizedTier) {
    case 'bronze':
      return 'Bronze';
    case 'silver': 
      return 'Argent';
    case 'gold':
      return 'Or';
    case 'platinum':
      return 'Platine';
    case 'diamond':
      return 'Diamant';
    default:
      return tier || 'Unknown';
  }
};
