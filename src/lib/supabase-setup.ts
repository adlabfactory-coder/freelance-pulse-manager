
import { supabase } from './supabase-client';
import { DatabaseSetupOptions, DatabaseSetupResult, DatabaseSetupStatus, TableSetupStatus } from '@/types/supabase-types';
import { Database } from '@/types/database';

// Define type-safe table names
type TableName = keyof Database['public']['Tables'];

// Use an array of literal table names instead of string literals
const tableNames: TableName[] = [
  'users', 
  'contacts', 
  'appointments', 
  'quotes', 
  'subscriptions', 
  'commissions', 
  'commission_rules', 
  'quote_items'
];

// Function to check if the database is correctly configured
export const checkDatabaseSetup = async (): Promise<DatabaseSetupStatus> => {
  try {
    const results = await Promise.all(
      tableNames.map(async (table) => {
        try {
          // Use properly typed table name
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
    
    // For the other tables, we'll use execute_sql instead of trying to call non-existent RPC functions
    // Create contacts table if it doesn't exist
    if (dbStatus.missingTables?.includes('contacts')) {
      const createContactsSQL = `
        CREATE TABLE IF NOT EXISTS contacts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          company TEXT,
          position TEXT,
          address TEXT,
          notes TEXT,
          "assignedTo" UUID REFERENCES users(id),
          status contact_status NOT NULL DEFAULT 'lead',
          subscription_plan_id UUID REFERENCES subscription_plans(id),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createContactsSQL });
      
      if (!error) {
        notifyTableCreated('contacts');
        results.push({ table: 'contacts', success: true });
      } else {
        results.push({ table: 'contacts', success: false, error: error.message });
      }
    }
    
    // Create appointments table if it doesn't exist
    if (dbStatus.missingTables?.includes('appointments')) {
      const createAppointmentsSQL = `
        CREATE TABLE IF NOT EXISTS appointments (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT,
          "contactId" UUID NOT NULL REFERENCES contacts(id),
          "freelancerId" UUID NOT NULL REFERENCES users(id),
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          duration INTEGER NOT NULL,
          status TEXT NOT NULL,
          location TEXT,
          notes TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createAppointmentsSQL });
      
      if (!error) {
        notifyTableCreated('appointments');
        results.push({ table: 'appointments', success: true });
      } else {
        results.push({ table: 'appointments', success: false, error: error.message });
      }
    }
    
    // Create quotes table if it doesn't exist
    if (dbStatus.missingTables?.includes('quotes')) {
      const createQuotesSQL = `
        CREATE TABLE IF NOT EXISTS quotes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "contactId" UUID NOT NULL REFERENCES contacts(id),
          "freelancerId" UUID NOT NULL REFERENCES users(id),
          "totalAmount" NUMERIC NOT NULL,
          status TEXT NOT NULL,
          "validUntil" TIMESTAMP WITH TIME ZONE NOT NULL,
          notes TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createQuotesSQL });
      
      if (!error) {
        notifyTableCreated('quotes');
        results.push({ table: 'quotes', success: true });
      } else {
        results.push({ table: 'quotes', success: false, error: error.message });
      }
    }
    
    // Create quote_items table if it doesn't exist
    if (dbStatus.missingTables?.includes('quote_items')) {
      const createQuoteItemsSQL = `
        CREATE TABLE IF NOT EXISTS quote_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "quoteId" UUID NOT NULL REFERENCES quotes(id),
          description TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          "unitPrice" NUMERIC NOT NULL,
          discount NUMERIC,
          tax NUMERIC
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createQuoteItemsSQL });
      
      if (!error) {
        notifyTableCreated('quote_items');
        results.push({ table: 'quote_items', success: true });
      } else {
        results.push({ table: 'quote_items', success: false, error: error.message });
      }
    }
    
    // Create subscriptions table if it doesn't exist
    if (dbStatus.missingTables?.includes('subscriptions')) {
      const createSubscriptionsSQL = `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          price NUMERIC NOT NULL,
          interval TEXT NOT NULL,
          "clientId" UUID NOT NULL REFERENCES users(id),
          "freelancerId" UUID NOT NULL REFERENCES users(id),
          status TEXT NOT NULL,
          "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
          "endDate" TIMESTAMP WITH TIME ZONE,
          "renewalDate" TIMESTAMP WITH TIME ZONE,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createSubscriptionsSQL });
      
      if (!error) {
        notifyTableCreated('subscriptions');
        results.push({ table: 'subscriptions', success: true });
      } else {
        results.push({ table: 'subscriptions', success: false, error: error.message });
      }
    }
    
    // Create commissions table if it doesn't exist
    if (dbStatus.missingTables?.includes('commissions')) {
      const createCommissionsSQL = `
        CREATE TABLE IF NOT EXISTS commissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "freelancerId" UUID NOT NULL REFERENCES users(id),
          amount NUMERIC NOT NULL,
          tier TEXT NOT NULL,
          "subscriptionId" UUID REFERENCES subscriptions(id),
          "quoteId" UUID REFERENCES quotes(id),
          "periodStart" TIMESTAMP WITH TIME ZONE NOT NULL,
          "periodEnd" TIMESTAMP WITH TIME ZONE NOT NULL,
          status TEXT NOT NULL,
          "paidDate" TIMESTAMP WITH TIME ZONE,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createCommissionsSQL });
      
      if (!error) {
        notifyTableCreated('commissions');
        results.push({ table: 'commissions', success: true });
      } else {
        results.push({ table: 'commissions', success: false, error: error.message });
      }
    }
    
    // Create commission_rules table if it doesn't exist
    if (dbStatus.missingTables?.includes('commission_rules')) {
      const createCommissionRulesSQL = `
        CREATE TABLE IF NOT EXISTS commission_rules (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          tier TEXT NOT NULL,
          "minContracts" INTEGER NOT NULL,
          percentage NUMERIC NOT NULL
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createCommissionRulesSQL });
      
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
