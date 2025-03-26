
export type CommissionStatus = 'pending' | 'paid' | 'rejected' | 'processing';

export interface CommissionRule {
  id: string;
  tier: string;
  minContracts: number;
  percentage: number;
}

export interface Commission {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  tier: string;
  periodStart: Date;
  periodEnd: Date;
  status: CommissionStatus;
  paidDate?: Date;
  paymentRequested: boolean;
}
