
export type CommissionStatus = 'pending' | 'processing' | 'paid' | 'cancelled' | 'rejected';

// Define commission tiers as string constants instead of an enum to fix the "used as a value" errors
export const CommissionTierValues = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond'
} as const;

// Type alias for commission tier
export type CommissionTier = typeof CommissionTierValues[keyof typeof CommissionTierValues];

export interface Commission {
  id: string;
  freelancerId: string;
  quoteId?: string;
  subscriptionId?: string;
  tier: CommissionTier;
  amount: number;
  status: CommissionStatus;
  periodStart: Date;
  periodEnd: Date;
  paidDate?: Date | null;
  payment_requested: boolean;
  contracts_count?: number;
  createdAt?: Date;
  deleted_at?: Date | null;
}

export interface CommissionRule {
  id: string;
  tier: CommissionTier;
  percentage: number;
  unit_amount: number;
  minContracts: number;
  maxContracts?: number | null;
}

// Type for commissions with details
export interface CommissionWithDetails extends Commission {
  freelancerName?: string;
  freelancerEmail?: string;
  period?: string; // Format: "MM/YYYY" for display
  // Add subscription details for FreelancerCommissionsList
  subscriptionDetails?: {
    name?: string;
    client?: {
      name?: string;
    };
  };
}
