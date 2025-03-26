
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Utilisation des valeurs constantes pour garantir la cohérence
const SUPABASE_URL = "https://cvgwwdwnfmnkiyxqfmnn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A";

// Création du client Supabase
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-AdLabHub-Client': 'web-app'
      }
    }
  }
);

// Vérification de la configuration
export const validateSupabaseConnection = (): boolean => {
  try {
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      console.error("Configuration Supabase incomplète");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erreur lors de la validation de la configuration Supabase:", error);
    return false;
  }
};

// Exécuter la validation au démarrage
console.info("Validation de la configuration Supabase:", validateSupabaseConnection() ? "Succès" : "Échec");
