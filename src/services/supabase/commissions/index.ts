
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { fetchCommissions } from './fetch-commissions';
import { fetchCommissionRules } from './fetch-rules';
import { requestPayment, approvePayment } from './payment-operations';
import { generateCommissions } from './generate-commissions';

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
      generateCommissions(month.getMonth() + 1, month.getFullYear())
  };
};

// Export types without conflicts - using 'export type' for type exports
export type { CommissionServiceOptions } from './types';

// Export utils but not the types to avoid duplication
export * from './utils';

// Export individual operation modules but avoid naming conflicts
export { fetchCommissions } from './fetch-commissions';
export { fetchCommissionRules as getFetchCommissionRules } from './fetch-rules';
export { requestPayment, approvePayment } from './payment-operations';
export { generateCommissions } from './generate-commissions';

