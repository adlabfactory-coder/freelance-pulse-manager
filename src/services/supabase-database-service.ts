
import { 
  checkDatabaseSetup, 
  setupDatabase 
} from '@/lib/supabase';
import { DatabaseSetupOptions } from '@/types/supabase-types';
import { supabase } from '@/lib/supabase-client';

// Method to check Supabase connection status
export const checkSupabaseStatus = async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error("Erreur de connexion à Supabase:", error);
      return { 
        success: false, 
        message: "Impossible de se connecter à Supabase", 
        networkError: error.code === 'NETWORK_ERROR' 
      };
    }
    
    return { success: true, message: "Connexion à Supabase établie avec succès" };
  } catch (error) {
    console.error("Erreur inattendue lors de la connexion à Supabase:", error);
    return { 
      success: false, 
      message: "Erreur inattendue lors de la connexion à Supabase",
      networkError: true
    };
  }
};

// Method to check database configuration
export const checkDatabaseStatus = async () => {
  const dbStatus = await checkDatabaseSetup();
  return dbStatus;
};

// Method to initialize the database
export const initializeDatabase = async (options?: DatabaseSetupOptions) => {
  const setupResult = await setupDatabase(options);
  return setupResult;
};
