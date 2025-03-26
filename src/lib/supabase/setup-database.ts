
import { supabase } from './supabase-client';
import { DatabaseSetupOptions, DatabaseSetupResult, TableSetupStatus } from './types';
import { checkDatabaseSetup } from './check-database';
import { getCreateTableSql } from './table-definitions';

/**
 * Sets up the database with missing tables
 */
export const setupDatabase = async (options?: DatabaseSetupOptions): Promise<DatabaseSetupResult> => {
  try {
    // First check which tables are missing
    const dbStatus = await checkDatabaseSetup();
    
    if (dbStatus.success) {
      return { success: true, message: 'La base de données est déjà correctement configurée' };
    }
    
    const results: TableSetupStatus[] = [];
    
    // Helper function to notify when a table is created
    const notifyTableCreated = (tableName: string) => {
      if (options?.onTableCreated) {
        options.onTableCreated(tableName);
      }
    };
    
    // Create missing tables
    if (dbStatus.missingTables && dbStatus.missingTables.length > 0) {
      for (const tableName of dbStatus.missingTables) {
        try {
          // Build the appropriate SQL query for each table
          const sqlQuery = getCreateTableSql(tableName);
          
          if (sqlQuery) {
            const { error } = await supabase.rpc('execute_sql', { sql: sqlQuery });
            
            if (!error) {
              notifyTableCreated(tableName);
              results.push({ table: tableName, success: true });
            } else {
              results.push({ table: tableName, success: false, error: error.message });
            }
          } else {
            results.push({ 
              table: tableName, 
              success: false, 
              error: `Pas de requête SQL disponible pour la table ${tableName}` 
            });
          }
        } catch (tableError: any) {
          results.push({ 
            table: tableName, 
            success: false, 
            error: tableError.message || `Erreur lors de la création de la table ${tableName}` 
          });
        }
      }
    }
    
    // Check if installation was successful
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      return {
        success: false,
        message: `Certaines tables n'ont pas pu être créées: ${failures.map(f => f.table).join(', ')}`,
        details: failures
      };
    }
    
    return {
      success: true,
      message: 'Base de données configurée avec succès',
      details: results
    };
  } catch (error: any) {
    console.error('Erreur lors de la configuration de la base de données:', error);
    return {
      success: false,
      message: 'Erreur lors de la configuration de la base de données: ' + (error.message || 'Erreur inconnue')
    };
  }
};
