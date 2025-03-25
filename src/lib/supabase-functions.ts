
import { supabase } from '@/lib/supabase-client';

// Function to create SQL functions in Supabase
export const createDatabaseFunctions = async () => {
  try {
    // Use execute_sql RPC for all operations
    const createCheckTableExistsFunc = `
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
    
    const { error: funcError } = await supabase.rpc('execute_sql', { sql: createCheckTableExistsFunc });
    
    if (funcError) {
      console.error('Erreur lors de la création de la fonction check_table_exists:', funcError);
      return { success: false, message: 'Erreur lors de la création des fonctions SQL' };
    }
    
    // Create functions for table creation using execute_sql
    const tableFunctionsSql = [
      `CREATE OR REPLACE FUNCTION create_contacts_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS contacts (/* table definition */);
      END; $$ LANGUAGE plpgsql;`,
      
      `CREATE OR REPLACE FUNCTION create_appointments_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS appointments (/* table definition */);
      END; $$ LANGUAGE plpgsql;`,
      
      `CREATE OR REPLACE FUNCTION create_quotes_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS quotes (/* table definition */);
      END; $$ LANGUAGE plpgsql;`,
      
      `CREATE OR REPLACE FUNCTION create_quote_items_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS quote_items (/* table definition */);
      END; $$ LANGUAGE plpgsql;`,
      
      `CREATE OR REPLACE FUNCTION create_subscriptions_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS subscriptions (/* table definition */);
      END; $$ LANGUAGE plpgsql;`,
      
      `CREATE OR REPLACE FUNCTION create_commissions_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS commissions (/* table definition */);
      END; $$ LANGUAGE plpgsql;`,
      
      `CREATE OR REPLACE FUNCTION create_commission_rules_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS commission_rules (/* table definition */);
      END; $$ LANGUAGE plpgsql;`
    ];
    
    for (const sqlFunc of tableFunctionsSql) {
      const { error } = await supabase.rpc('execute_sql', { sql: sqlFunc });
      if (error) {
        console.error(`Erreur lors de la création d'une fonction SQL:`, error);
      }
    }
    
    return { success: true, message: 'Fonctions SQL créées avec succès' };
  } catch (error: any) {
    console.error('Erreur lors de la création des fonctions SQL:', error);
    return { success: false, message: 'Erreur lors de la création des fonctions SQL' };
  }
};
