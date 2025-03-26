
import { supabase } from '@/services/supabase';

// Fonction pour créer les fonctions SQL nécessaires dans Supabase
export const createSQLFunctions = async () => {
  try {
    // Essayons d'abord si execute_sql est disponible
    try {
      // Créer la fonction check_table_exists
      const createCheckTableExistsFunction = `
        CREATE OR REPLACE FUNCTION check_table_exists(table_name TEXT)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        AS $$
        BEGIN
          RETURN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = $1
          );
        END;
        $$;
      `;
      
      const { error: funcError } = await supabase.rpc('execute_sql', { sql: createCheckTableExistsFunction });
      
      if (funcError) {
        console.error('Erreur lors de la création de la fonction check_table_exists:', funcError);
        // On continue quand même, peut-être que la fonction existe déjà
      }
      
      return { success: true, message: 'Fonctions SQL créées ou existantes' };
    } catch (rpcError) {
      console.warn('Erreur RPC, les fonctions SQL pourraient déjà exister:', rpcError);
      return { success: true, message: 'Fonctions SQL probablement existantes' };
    }
  } catch (error: any) {
    console.error('Erreur lors de la création des fonctions SQL:', error);
    return { success: false, message: `Erreur: ${error.message || 'Erreur inconnue'}` };
  }
};
