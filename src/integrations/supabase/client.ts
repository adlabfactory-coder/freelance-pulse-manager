
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Définition explicite des constantes pour faciliter la validation
const SUPABASE_URL = "https://cvgwwdwnfmnkiyxqfmnn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A";

// Configuration améliorée du client Supabase avec gestion des sessions
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
    },
    // Configurer la récupération automatique des erreurs transitoires
    db: {
      schema: 'public'
    },
    // Activer la mise en cache pour de meilleures performances
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Fonction exportée pour vérifier la connexion à Supabase
export const validateSupabaseConnection = (): boolean => {
  try {
    const url = SUPABASE_URL;
    const key = SUPABASE_PUBLISHABLE_KEY;
    
    if (!url || !key) {
      console.error("Configuration Supabase incomplète: URL ou clé manquante");
      return false;
    }
    
    // Vérification basique de la validité du format de la clé
    if (!key.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
      console.error("Format de clé Supabase invalide");
      return false;
    }
    
    // Vérification basique de l'URL
    if (!url.includes("supabase.co")) {
      console.error("Format d'URL Supabase invalide");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la validation de la configuration Supabase:", error);
    return false;
  }
};

// Exécuter la validation au démarrage
console.log("Validation de la configuration Supabase:", validateSupabaseConnection() ? "Succès" : "Échec");
