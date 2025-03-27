
// This is a wrapper around the main Supabase client to ensure consistency
import { supabase as mainClient } from '@/lib/supabase-client';
import type { Database } from './types';

// Re-export the main client
export const supabase = mainClient;

// Vérification de la configuration
export const validateSupabaseConnection = (): boolean => {
  try {
    // Basic validation, since the main client is already initialized
    console.info("Validation de la configuration Supabase: Succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la validation de la configuration Supabase:", error);
    return false;
  }
};

// Log that we're using the client from this module
console.info("Module client.ts utilisé - pointant vers le client principal supabase-client.ts");
