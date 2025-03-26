
export type CommissionStatus = 'pending' | 'paid' | 'rejected' | 'processing';

// Nous gardons l'énumération des paliers pour maintenir la compatibilité
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
  // On ne calcule plus par pourcentage mais par montant fixe par contrat
  unitAmount: number; // Montant fixe par contrat validé
  percentage?: number; // Gardé pour compatibilité mais non utilisé
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
  // Nouvelles propriétés pour détailler le calcul
  contractsCount?: number; // Nombre de contrats dans cette période
  unitAmount?: number; // Montant unitaire appliqué
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
