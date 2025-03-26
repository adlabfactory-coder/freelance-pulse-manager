
export type CommissionStatus = 'pending' | 'paid' | 'rejected' | 'processing';

// Update CommissionTier to be a string enum, not just a type
export enum CommissionTier {
  TIER_1 = 'bronze',  // Moins de 10 contrats
  TIER_2 = 'silver',  // 11 à 20 contrats
  TIER_3 = 'gold',    // 21 à 30 contrats
  TIER_4 = 'platinum' // 31+ contrats
}

export interface CommissionRule {
  id: string;
  tier: CommissionTier;
  minContracts: number;
  maxContracts?: number | null;
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
