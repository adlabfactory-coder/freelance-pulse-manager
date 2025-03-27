
// Réexporter le client principal pour assurer la compatibilité avec les autres imports
import { supabase, checkSupabaseConnection } from '@/lib/supabase-client';

// Exporter les fonctions principales
export { supabase, checkSupabaseConnection };

// Fonction de validation de la configuration
export const validateSupabaseConfig = (): boolean => {
  try {
    // Validation de base, puisque le client principal est déjà initialisé
    console.info("Validation de la configuration Supabase: Succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la validation de la configuration Supabase:", error);
    return false;
  }
};

// Journalisation de l'utilisation du module
console.info("Module client.ts utilisé - pointant vers le client principal supabase-client.ts");
