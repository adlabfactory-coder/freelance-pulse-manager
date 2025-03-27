
import { supabase } from '@/lib/supabase-client';
import { Commission, CommissionRule, CommissionStatus, CommissionTier, CommissionTierValues } from '@/types/commissions';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface CommissionServiceOptions {
  client: any;  // Using any to avoid circular dependencies
}

/**
 * Fetches commissions for a user
 */
export const fetchCommissionsByUserId = async (userId: string): Promise<Commission[]> => {
  try {
    // In a real implementation, we would fetch from Supabase
    // For now, return simulated data
    const today = new Date();
    
    // Simulated data for demonstration
    return [
      {
        id: '1',
        freelancerId: userId,
        tier: CommissionTierValues.GOLD,
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
        tier: CommissionTierValues.GOLD,
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
        tier: CommissionTierValues.PLATINUM,
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
    console.error('Error fetching commissions:', error);
    return [];
  }
};

/**
 * Fetches all commission rules
 */
export const fetchCommissionRules = async (): Promise<CommissionRule[]> => {
  try {
    // In a real implementation, we would fetch from Supabase
    // For now, return simulated data
    return [
      {
        id: '1',
        tier: CommissionTierValues.BRONZE,
        percentage: 2,
        unit_amount: 0,
        minContracts: 1,
        maxContracts: 5
      },
      {
        id: '2',
        tier: CommissionTierValues.SILVER,
        percentage: 3,
        unit_amount: 0,
        minContracts: 6,
        maxContracts: 10
      },
      {
        id: '3',
        tier: CommissionTierValues.GOLD,
        percentage: 5,
        unit_amount: 100,
        minContracts: 11,
        maxContracts: 20
      },
      {
        id: '4',
        tier: CommissionTierValues.PLATINUM,
        percentage: 7,
        unit_amount: 250,
        minContracts: 21,
        maxContracts: 30
      },
      {
        id: '5',
        tier: CommissionTierValues.DIAMOND,
        percentage: 10,
        unit_amount: 500,
        minContracts: 31,
        maxContracts: null
      }
    ];
  } catch (error) {
    console.error('Error fetching commission rules:', error);
    return [];
  }
};

/**
 * Formats a commission's period (e.g. "January 2023")
 */
export const formatCommissionPeriod = (commission: Commission): string => {
  if (!commission.periodStart || !commission.periodEnd) return '-';
  
  const start = new Date(commission.periodStart);
  
  // Format with date-fns
  return format(start, 'MMMM yyyy', { locale: fr });
};

// Map tier from database
export const mapTierFromDb = (tierString: string): CommissionTier => {
  switch (tierString.toLowerCase()) {
    case 'bronze': return CommissionTierValues.BRONZE;
    case 'silver': return CommissionTierValues.SILVER;
    case 'gold': return CommissionTierValues.GOLD;
    case 'platinum': return CommissionTierValues.PLATINUM;
    case 'diamond': return CommissionTierValues.DIAMOND;
    default: return CommissionTierValues.BRONZE;
  }
};

// Map tier to database
export const mapTierToDb = (tier: CommissionTier): string => {
  return tier.toLowerCase();
};

// Map commission from database
export const mapCommissionFromDb = (dbRecord: any): Commission => {
  return {
    id: dbRecord.id,
    freelancerId: dbRecord.freelancerId,
    tier: mapTierFromDb(dbRecord.tier),
    amount: dbRecord.amount,
    status: dbRecord.status,
    periodStart: new Date(dbRecord.periodStart),
    periodEnd: new Date(dbRecord.periodEnd),
    paidDate: dbRecord.paidDate ? new Date(dbRecord.paidDate) : null,
    payment_requested: !!dbRecord.payment_requested,
    contracts_count: dbRecord.contracts_count || 0,
    createdAt: dbRecord.createdAt ? new Date(dbRecord.createdAt) : new Date(),
    deleted_at: dbRecord.deleted_at ? new Date(dbRecord.deleted_at) : null,
    quoteId: dbRecord.quoteId,
    subscriptionId: dbRecord.subscriptionId
  };
};

// Map commission rule from database
export const mapCommissionRuleFromDb = (dbRule: any): CommissionRule => {
  return {
    id: dbRule.id,
    tier: mapTierFromDb(dbRule.tier),
    percentage: dbRule.percentage || 0,
    unit_amount: dbRule.unit_amount || 0,
    minContracts: dbRule.minContracts || 0,
    maxContracts: dbRule.maxContracts
  };
};

// Get default commission rules
export const getDefaultCommissionRules = (): CommissionRule[] => {
  return [
    {
      id: 'default-1',
      tier: CommissionTierValues.BRONZE,
      percentage: 2,
      unit_amount: 500,
      minContracts: 1,
      maxContracts: 10
    },
    {
      id: 'default-2',
      tier: CommissionTierValues.SILVER,
      percentage: 3,
      unit_amount: 1000,
      minContracts: 11,
      maxContracts: 20
    },
    {
      id: 'default-3',
      tier: CommissionTierValues.GOLD,
      percentage: 5,
      unit_amount: 1500,
      minContracts: 21,
      maxContracts: 30
    },
    {
      id: 'default-4',
      tier: CommissionTierValues.PLATINUM,
      percentage: 7,
      unit_amount: 2000,
      minContracts: 31,
      maxContracts: null
    }
  ];
};
