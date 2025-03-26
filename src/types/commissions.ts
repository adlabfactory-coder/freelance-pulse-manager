
export type CommissionStatus = 'pending' | 'paid' | 'rejected' | 'processing';

// Add CommissionTier type
export type CommissionTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface CommissionRule {
  id: string;
  tier: string;
  minContracts: number;
  maxContracts?: number; // Make maxContracts optional
  percentage: number;
  amount?: number; // Add amount property as optional
}

export interface Commission {
  id: string;
  freelancerId: string;
  freelancerName: string; // Add freelancerName property
  amount: number;
  tier: string;
  periodStart: Date;
  periodEnd: Date;
  status: CommissionStatus;
  paidDate?: Date;
  paymentRequested: boolean;
  period?: string; // Add period property as optional
}

// Add CommissionDetails interface to handle subscription details
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
