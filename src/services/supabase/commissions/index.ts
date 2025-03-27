
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { fetchCommissions } from './fetch-commissions';
import { fetchCommissionRules } from './fetch-rules';
import { requestPayment, approvePayment } from './payment-operations';
import { generateMonthlyCommissions } from './generate-commissions';

// Import from utils separately to avoid re-export conflicts
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

// Export common utilities and types
export * from './utils';
export * from './types';

// Export individual operation modules but avoid naming conflicts
export { fetchCommissions } from './fetch-commissions';
export { fetchCommissionRules as getFetchCommissionRules } from './fetch-rules';
export { requestPayment, approvePayment } from './payment-operations';
export { generateMonthlyCommissions } from './generate-commissions';
