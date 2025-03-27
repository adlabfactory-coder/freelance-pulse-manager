
import { supabase } from './client';
import { DatabaseSetupStatus } from './types';
import { tableNames } from './table-definitions';

/**
 * Checks if the database is correctly configured
 */
export const checkDatabaseSetup = async (): Promise<DatabaseSetupStatus> => {
  try {
    const results = await Promise.all(
      tableNames.map(async (table) => {
        try {
          // Try to use the check_table_exists RPC function if available
          try {
            const { data, error } = await supabase.rpc('check_table_exists', { table_name: table });
            return { table, exists: data === true };
          } catch (err) {
            // Fallback: try to access the table directly
            const { error } = await supabase.from(table).select('id').limit(1);
            return { table, exists: !error || error.code !== '42P01' };
          }
        } catch (err) {
          return { table, exists: false };
        }
      })
    );
    
    const missingTables = results.filter(r => !r.exists).map(r => r.table);
    
    return {
      success: missingTables.length === 0,
      missingTables,
      message: missingTables.length > 0 
        ? `Tables manquantes: ${missingTables.join(', ')}` 
        : 'Toutes les tables sont correctement configurées'
    };
  } catch (error: any) {
    console.error('Erreur lors de la vérification de la configuration de la base de données:', error);
    return {
      success: false,
      message: 'Impossible de vérifier la configuration de la base de données: ' + (error.message || 'Erreur inconnue')
    };
  }
};
