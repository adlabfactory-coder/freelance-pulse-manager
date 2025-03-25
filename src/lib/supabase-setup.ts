
import { supabase } from './supabase-client';
import { DatabaseSetupOptions, DatabaseSetupResult, DatabaseSetupStatus, TableSetupStatus } from '@/types/supabase-types';

// Function to check if the database is correctly configured
export const checkDatabaseSetup = async (): Promise<DatabaseSetupStatus> => {
  try {
    const tables = ['users', 'contacts', 'appointments', 'quotes', 'subscriptions', 'commissions', 'commission_rules', 'quote_items'];
    const results = await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase.from(table).select('id').limit(1);
        return { table, exists: !error || error.code !== '42P01' };
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

// Function to setup the database with missing tables
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
    
    // Create users table if it doesn't exist
    if (dbStatus.missingTables?.includes('users')) {
      // Using direct SQL method with from instead of query
      const { error: usersError } = await supabase.from('users').insert([
        {
          name: "Admin Démo",
          email: "admin@example.com",
          role: "admin",
          calendly_url: "https://calendly.com/admin-demo",
          calendly_enabled: true,
          calendly_sync_email: "admin@example.com"
        }
      ]);
      
      if (!usersError) {
        notifyTableCreated('users');
        results.push({ table: 'users', success: true });
      } else {
        results.push({ table: 'users', success: false, error: usersError.message });
      }
    }
    
    // Create contacts table if it doesn't exist
    if (dbStatus.missingTables?.includes('contacts')) {
      const { error } = await supabase.rpc('create_contacts_table');
      
      if (!error) {
        notifyTableCreated('contacts');
        results.push({ table: 'contacts', success: true });
      } else {
        results.push({ table: 'contacts', success: false, error: error.message });
      }
    }
    
    // Create appointments table if it doesn't exist
    if (dbStatus.missingTables?.includes('appointments')) {
      const { error } = await supabase.rpc('create_appointments_table');
      
      if (!error) {
        notifyTableCreated('appointments');
        results.push({ table: 'appointments', success: true });
      } else {
        results.push({ table: 'appointments', success: false, error: error.message });
      }
    }
    
    // Create quotes table if it doesn't exist
    if (dbStatus.missingTables?.includes('quotes')) {
      const { error } = await supabase.rpc('create_quotes_table');
      
      if (!error) {
        notifyTableCreated('quotes');
        results.push({ table: 'quotes', success: true });
      } else {
        results.push({ table: 'quotes', success: false, error: error.message });
      }
    }
    
    // Create quote_items table if it doesn't exist
    if (dbStatus.missingTables?.includes('quote_items')) {
      const { error } = await supabase.rpc('create_quote_items_table');
      
      if (!error) {
        notifyTableCreated('quote_items');
        results.push({ table: 'quote_items', success: true });
      } else {
        results.push({ table: 'quote_items', success: false, error: error.message });
      }
    }
    
    // Create subscriptions table if it doesn't exist
    if (dbStatus.missingTables?.includes('subscriptions')) {
      const { error } = await supabase.rpc('create_subscriptions_table');
      
      if (!error) {
        notifyTableCreated('subscriptions');
        results.push({ table: 'subscriptions', success: true });
      } else {
        results.push({ table: 'subscriptions', success: false, error: error.message });
      }
    }
    
    // Create commissions table if it doesn't exist
    if (dbStatus.missingTables?.includes('commissions')) {
      const { error } = await supabase.rpc('create_commissions_table');
      
      if (!error) {
        notifyTableCreated('commissions');
        results.push({ table: 'commissions', success: true });
      } else {
        results.push({ table: 'commissions', success: false, error: error.message });
      }
    }
    
    // Create commission_rules table if it doesn't exist
    if (dbStatus.missingTables?.includes('commission_rules')) {
      const { error } = await supabase.rpc('create_commission_rules_table');
      
      if (!error) {
        notifyTableCreated('commission_rules');
        results.push({ table: 'commission_rules', success: true });
      } else {
        results.push({ table: 'commission_rules', success: false, error: error.message });
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
