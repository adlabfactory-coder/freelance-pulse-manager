
import { supabase } from '@/lib/supabase';
import { 
  checkDatabaseStatus as checkDbStatus, 
  initializeDatabase as initDb
} from '@/services/supabase/setup';

/**
 * Checks if there's a valid connection to Supabase
 */
export const checkSupabaseStatus = async () => {
  try {
    // Simple connection check
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

/**
 * Checks the database setup status
 */
export const checkDatabaseStatus = async () => {
  return await checkDbStatus();
};

/**
 * Initializes the database with required tables
 */
export const initializeDatabase = async (options: any = {}) => {
  return await initDb(options);
};
