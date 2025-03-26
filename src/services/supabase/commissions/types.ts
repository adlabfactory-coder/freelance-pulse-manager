
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Commission, CommissionStatus, CommissionTier } from '@/types/commissions';
import { UserRole } from '@/types';

export interface CommissionServiceOptions {
  client: SupabaseClient<Database>;
}

export interface CommissionDbRecord {
  id: string;
  freelancerId: string;
  amount: number;
  tier: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  paidDate?: string | null;
  payment_requested?: boolean;
  freelancer?: {
    name?: string;
  };
}

export interface CommissionRuleDbRecord {
  id: string;
  tier: string;
  minContracts: number;
  maxContracts?: number | null;
  percentage: number;
  amount?: number | null;
}
