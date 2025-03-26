
import { supabase } from './supabase-client';
import { DatabaseConnectionStatus } from '@/types/supabase-types';

// Function to verify the Supabase connection status
export const checkSupabaseConnection = async (): Promise<DatabaseConnectionStatus> => {
  try {
    // Try a simple operation that doesn't depend on a specific table
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur de connexion à Supabase (auth):', authError.message);
      return { 
        success: false, 
        message: 'Erreur de connexion à Supabase: ' + authError.message,
        networkError: true 
      };
    }
    
    // Also check that tables are accessible by trying to access a common table
    try {
      const { error: tableError } = await supabase.from('users').select('id').limit(1);
      
      if (tableError && tableError.code === '42P01') { // Code pour "relation does not exist"
        console.warn('Table users non trouvée:', tableError.message);
        return { 
          success: false, 
          message: 'Base de données non configurée correctement. Tables non trouvées.',
          needsSetup: true 
        };
      } else if (tableError) {
        console.warn('Erreur lors de l\'accès aux tables:', tableError.message);
        return { 
          success: false, 
          message: 'Erreur d\'accès aux données: ' + tableError.message 
        };
      }
    } catch (tableCheckError) {
      console.warn('Erreur lors de la vérification des tables:', tableCheckError);
      // We don't fail the complete check if only the tables are inaccessible
      return { 
        success: false, 
        message: 'Erreur lors de la vérification des tables',
        networkError: true
      };
    }
    
    return { success: true, message: 'Connexion à Supabase réussie' };
  } catch (error: any) {
    console.error('Erreur générale de connexion à Supabase:', error);
    return { 
      success: false, 
      message: 'Erreur de connexion à Supabase: ' + (error.message || 'Erreur inconnue'),
      networkError: true
    };
  }
};
