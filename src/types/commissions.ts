export type CommissionStatus = 'pending' | 'paid' | 'rejected' | 'processing';

// We keep the enumeration of tiers for backward compatibility
export enum CommissionTier {
  TIER_1 = 'bronze',
  TIER_2 = 'silver',
  TIER_3 = 'gold',
  TIER_4 = 'platinum'
}

export interface CommissionRule {
  id: string;
  tier: CommissionTier;
  minContracts: number;
  maxContracts?: number | null;
  // We now calculate using a fixed amount per contract instead of a percentage
  unitAmount: number; // Fixed amount per validated contract
  percentage?: number; // Kept for compatibility but not used
}

export interface Commission {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  tier: CommissionTier;
  periodStart: Date;
  periodEnd: Date;
  status: CommissionStatus;
  paidDate?: Date;
  paymentRequested: boolean;
  period?: string;
  // New properties to detail the calculation
  contractsCount?: number; // Number of contracts in this period
  unitAmount?: number; // Unit amount applied
  subscriptionId?: string; // Add this to connect to subscription
  quoteId?: string; // Add this to connect to quote
}

// Define a new interface for commission details including subscription information
export interface CommissionDetails {
  subscriptionDetails?: {
    name?: string;
    clientId?: string;
    client?: {
      name?: string;
    };
  };
}

// Create a combined type for commissions with details
export type CommissionWithDetails = Commission & CommissionDetails;
