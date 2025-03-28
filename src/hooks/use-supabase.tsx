
// Re-export everything from the refactored hooks
export { 
  useSupabaseContext,
  SupabaseContextProvider,
  useAuthOperations,
  useUserOperations,
  useDatabaseStatus
} from './supabase';

// Export the provider and hook directly (avoid duplicate exports)
export { 
  SupabaseProvider, 
  useSupabase,
  type OperationResult 
} from './supabase/supabase-provider';

// Export types
export type { SupabaseContextType } from './supabase/supabase-provider';
