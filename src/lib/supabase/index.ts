
// Export main Supabase client and utilities
export { supabase, validateSupabaseConfig, checkSupabaseConnection } from './client';

// Export types
export type { Database } from '@/types/database';

// Re-export commonly used service factories
export { createAppointmentsService } from '@/services/supabase/appointments';
