
// Re-export everything from the refactored hooks
export { 
  useSupabaseContext,
  SupabaseContextProvider,
  useAuthOperations,
  useUserOperations,
  useDatabaseStatus
} from './supabase';

// Export the provider and hook for backward compatibility
export { SupabaseProvider, useSupabase } from './supabase/supabase-provider';

// Export types
export type { SupabaseContextType } from './supabase/supabase-provider';
