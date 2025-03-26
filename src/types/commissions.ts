
export type CommissionStatus = 'pending' | 'paid' | 'rejected' | 'processing';

// Update CommissionTier to be a string enum, not just a type
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
  maxContracts?: number;
  percentage: number;
  amount?: number;
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
}

export interface CommissionDetails {
  subscriptionDetails?: {
    name?: string;
    clientId?: string;
    client?: {
      name?: string;
    };
  };
}

export type CommissionWithDetails = Commission & CommissionDetails;
