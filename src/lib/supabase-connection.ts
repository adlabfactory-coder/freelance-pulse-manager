
import { supabase } from './supabase-client';
import { DatabaseConnectionStatus } from '@/types/supabase-types';

// Function to verify the Supabase connection status
export const checkSupabaseConnection = async (): Promise<DatabaseConnectionStatus> => {
  try {
    // Try a simple operation that doesn't depend on a specific table
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur de connexion à Supabase (auth):', authError.message);
      return { success: false, message: 'Erreur de connexion à Supabase: ' + authError.message };
    }
    
    // Also check that tables are accessible by trying to access a common table
    try {
      const { error: tableError } = await supabase.from('contacts').select('id').limit(1);
      
      if (tableError && tableError.code === '42P01') { // Code for "relation does not exist"
        console.warn('Table contacts non trouvée:', tableError.message);
        return { 
          success: false, 
          message: 'Base de données non configurée correctement. Tables non trouvées.',
          needsSetup: true 
        };
      } else if (tableError) {
        console.warn('Erreur lors de l\'accès aux tables:', tableError.message);
        return { success: false, message: 'Erreur d\'accès aux données: ' + tableError.message };
      }
    } catch (tableCheckError) {
      console.warn('Erreur lors de la vérification des tables:', tableCheckError);
      // We don't fail the complete check if only the tables are inaccessible
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
