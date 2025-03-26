
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { fetchCommissions } from './fetch-commissions';
import { fetchCommissionRules } from './fetch-rules';
import { requestPayment, approvePayment } from './payment-operations';
import { generateMonthlyCommissions } from './generate-commissions';
import { CommissionServiceOptions } from './types';

export const createCommissionsService = (supabase: SupabaseClient<Database>) => {
  return {
    fetchCommissions: (userId: string, userRole: any) => 
      fetchCommissions(supabase, userId, userRole),
      
    fetchCommissionRules: () => 
      fetchCommissionRules(supabase),
      
    requestPayment: (commissionId: string, userId: string, userRole: any) => 
      requestPayment(supabase, commissionId, userId, userRole),
      
    approvePayment: (commissionId: string, userRole: any) => 
      approvePayment(supabase, commissionId, userRole),
      
    generateMonthlyCommissions: (month: Date, userRole: any) => 
      generateMonthlyCommissions(supabase, month, userRole)
  };
};

// Réexporter tous les modules pour usage avec importation destructurée
export * from './types';
export * from './utils';
export * from './fetch-commissions';
export * from './fetch-rules';
export * from './payment-operations';
export * from './generate-commissions';
