
// Export main Supabase client and utilities
export { supabase, validateSupabaseConfig, checkSupabaseConnection } from './client';

// Export types
export type { Database } from '@/types/database';

// Re-export database utils
export { checkDatabaseSetup } from './check-database';
export { tableNames } from './table-definitions';
export * from './types';

// Re-export commonly used service factories
export { createAppointmentsService } from '@/services/supabase/appointments';
export { createQuotesService } from '@/services/supabase/quotes';
export { createContactsService } from '@/services/supabase/contacts';
export { createUsersService } from '@/services/supabase/users';
