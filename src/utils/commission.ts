
import { CommissionRule } from '@/types/commissions';
import { format as dateFormat } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Get the start and end dates for a given month
 */
export const getMonthDates = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  
  return { start, end };
};

/**
 * Calculate the number of days between two dates
 */
export const getDaysBetweenDates = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format a date to a human-readable string
 */
export const formatDate = (date: Date): string => {
  return dateFormat(date, 'dd MMMM yyyy', { locale: fr });
};

/**
 * Format a period (month/year) to a human-readable string
 */
export const formatPeriod = (month: number, year: number): string => {
  const date = new Date(year, month - 1);
  return dateFormat(date, 'MMMM yyyy', { locale: fr });
};

/**
 * Determine commission tier based on number of contracts
 */
export const determineCommissionTier = (contractCount: number): string => {
  if (contractCount < 5) return 'bronze';
  if (contractCount < 10) return 'silver';
  if (contractCount < 20) return 'gold';
  return 'platinum';
};

/**
 * Get label for a commission tier
 */
export const getTierLabel = (tier: string): string => {
  const labels: Record<string, string> = {
    bronze: 'Bronze',
    silver: 'Argent',
    gold: 'Or',
    platinum: 'Platine'
  };
  
  return labels[tier] || tier;
};

/**
 * Calculate commission amount based on number of contracts and tier
 */
export const calculateCommissionAmount = (
  contractCount: number, 
  tier: string, 
  totalValue: number
): number => {
  // Simple calculation for demo purposes
  const baseRate = {
    bronze: 0.05,
    silver: 0.08,
    gold: 0.12,
    platinum: 0.15
  };
  
  const rate = baseRate[tier as keyof typeof baseRate] || 0.05;
  
  // Calculate based on contract total value
  return Math.round(totalValue * rate);
};
