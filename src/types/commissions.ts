
// Type pour les commissions
export interface Commission {
  id: string;
  freelancerId: string;
  freelancerName?: string;
  amount: number;
  tier: string;
  subscriptionId?: string | null;
  quoteId?: string | null;
  periodStart: Date;
  periodEnd: Date;
  status: CommissionStatus;
  paidDate?: Date | null;
  createdAt: Date;
  payment_requested?: boolean;
  contracts_count?: number;
}

// Type pour les règles de commission
export interface CommissionRule {
  id: string;
  tier: string;
  minContracts: number;
  maxContracts?: number | null;
  percentage: number;
  unit_amount?: number;
}

// Statut d'une commission
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected';

// Fonctions utilitaires pour les commissions
export const formatCommissionAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};
