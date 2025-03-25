
import { CommissionTier } from "@/types";

export interface Commission {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  tier: CommissionTier;
  period: {
    startDate: Date;
    endDate: Date;
  };
  status: string;
  paidDate?: Date;
  paymentRequested?: boolean;
}

export interface CommissionRule {
  tier: CommissionTier;
  minContracts: number;
  maxContracts: number | null;
  amount: number;
}

// Re-export the CommissionTier enum for convenience
export { CommissionTier } from "@/types";
