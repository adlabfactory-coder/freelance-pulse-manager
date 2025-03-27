
// Re-exporter le client Supabase principal pour garantir l'utilisation de la même instance partout
import { supabase, checkSupabaseConnection } from '@/lib/supabase-client';

// Re-exporter le client
export { supabase };

// Fonction wrapper pour maintenir la compatibilité de l'API
export const validateSupabaseConfig = (): boolean => {
  return true;
};

// Re-exporter la fonction de vérification de connexion avec l'API attendue
export const checkSupabaseConnection = async (): Promise<{success: boolean, message: string}> => {
  const result = await checkSupabaseConnection();
  return { 
    success: result, 
    message: result ? 'Connexion à Supabase réussie' : 'Erreur de connexion à Supabase'
  };
};
