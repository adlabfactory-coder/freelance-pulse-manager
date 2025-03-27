
export type CommissionStatus = 'pending' | 'processing' | 'paid' | 'cancelled';

export enum CommissionTierEnum {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

// Type alias pour assurer la compatibilité entre string et enum
export type CommissionTier = CommissionTierEnum | string;

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

// Type pour les commissions avec détails supplémentaires
export interface CommissionWithDetails extends Commission {
  freelancerName?: string;
  freelancerEmail?: string;
  period?: string; // Format: "MM/YYYY" pour l'affichage
}
