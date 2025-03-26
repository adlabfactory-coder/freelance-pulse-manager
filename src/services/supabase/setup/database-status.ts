
import { supabase } from '@/integrations/supabase/client';
import { DatabaseSetupStatus } from '../types';

// List of tables required by the application
export const tableNames = [
  'users', 
  'contacts', 
  'appointments', 
  'quotes', 
  'subscriptions', 
  'commissions', 
  'commission_rules', 
  'quote_items'
] as const;

/**
 * Checks if the database is correctly configured
 */
export const checkDatabaseStatus = async (): Promise<DatabaseSetupStatus> => {
  try {
    // Try to use the check_table_exists RPC function if available
    try {
      const results = await Promise.all(
        tableNames.map(async (table) => {
          try {
            const { data, error } = await supabase.rpc('check_table_exists', { table_name: table });
            return { table, exists: data === true };
          } catch (err) {
            // Fallback: try to access the table directly
            const { error } = await supabase.from(table).select('id').limit(1);
            return { table, exists: !error || error.code !== '42P01' };
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
    } catch (rpcError) {
      // Fallback: try to access tables directly
      console.warn('Impossible d\'utiliser check_table_exists RPC, utilisation de la méthode alternative:', rpcError);
      
      const results = await Promise.all(
        tableNames.map(async (table) => {
          try {
            const { error } = await supabase.from(table).select('id').limit(1);
            return { table, exists: !error || error.code !== '42P01' };
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
    }
  } catch (error: any) {
    console.error('Erreur lors de la vérification de la configuration de la base de données:', error);
    return {
      success: false,
      message: 'Impossible de vérifier la configuration de la base de données: ' + (error.message || 'Erreur inconnue')
    };
  }
};
