// Export the context provider and hook from supabase-provider
export { SupabaseProvider, useSupabase, SupabaseContextType } from './supabase-provider';

// Export specialized hooks
export { useAuthOperations } from './use-auth-operations';
export { useUserOperations } from './use-user-operations';
export { useDatabaseStatus } from './use-database-status';

// Export context provider and hook from context file (keep back compat)
export { useSupabaseContext, SupabaseContextProvider } from './supabase-context';
