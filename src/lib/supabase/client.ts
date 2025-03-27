
// Re-export the main Supabase client to ensure we use the same instance everywhere
import { supabase, checkSupabaseConnection as checkConnection } from '@/lib/supabase-client';

// Re-export the client
export { supabase };

// Wrapper function to maintain API compatibility
export const validateSupabaseConfig = (): boolean => {
  // The main client is already initialized with fallbacks
  return true;
};

// Re-export the check connection function with the expected API
export const checkSupabaseConnection = async (): Promise<{success: boolean, message: string}> => {
  const result = await checkConnection();
  return { 
    success: result, 
    message: result ? 'Connexion à Supabase réussie' : 'Erreur de connexion à Supabase'
  };
};
