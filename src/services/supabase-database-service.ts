
import { supabase } from '@/lib/supabase';
import { checkDatabaseSetup, setupDatabase } from '@/lib/supabase';

// Exporter les fonctions depuis lib/supabase pour une utilisation directe
export const checkSupabaseStatus = async () => {
  try {
    // Vérification simple de la connexion
    const { data, error } = await supabase.from('adlab hub freelancer').select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.warn('Erreur lors de la vérification de la connexion à Supabase:', error.message);
      return { success: false, message: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion à Supabase:', error);
    return { success: false, message: 'Impossible de se connecter à Supabase' };
  }
};

export const checkDatabaseStatus = async () => {
  return await checkDatabaseSetup();
};

export const initializeDatabase = async (options: any = {}) => {
  return await setupDatabase(options);
};
