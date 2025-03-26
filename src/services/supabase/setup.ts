
import { supabase } from '@/integrations/supabase/client';
import { 
  DatabaseSetupOptions, 
  DatabaseSetupResult, 
  DatabaseSetupStatus, 
  TableSetupStatus 
} from './types';

// Définir les noms de tables dans la base de données
const tableNames = [
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
 * Vérifie si la base de données est correctement configurée
 */
export const checkDatabaseStatus = async (): Promise<DatabaseSetupStatus> => {
  try {
    // Utiliser la fonction check_table_exists via RPC si disponible
    try {
      const results = await Promise.all(
        tableNames.map(async (table) => {
          try {
            const { data, error } = await supabase.rpc('check_table_exists', { table_name: table });
            return { table, exists: data === true };
          } catch (err) {
            // Fallback: essayer d'accéder directement à la table
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
      // Fallback: essayer d'accéder directement aux tables
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

/**
 * Initialise la base de données avec les tables manquantes
 */
export const initializeDatabase = async (options?: DatabaseSetupOptions): Promise<DatabaseSetupResult> => {
  try {
    // Vérifier d'abord quelles tables sont manquantes
    const dbStatus = await checkDatabaseStatus();
    
    if (dbStatus.success) {
      return { success: true, message: 'La base de données est déjà correctement configurée' };
    }
    
    const results: TableSetupStatus[] = [];
    
    // Fonction d'aide pour notifier quand une table est créée
    const notifyTableCreated = (tableName: string) => {
      if (options?.onTableCreated) {
        options.onTableCreated(tableName);
      }
    };
    
    // Utiliser la fonction execute_sql pour créer les tables manquantes
    if (dbStatus.missingTables && dbStatus.missingTables.length > 0) {
      for (const tableName of dbStatus.missingTables) {
        try {
          // Construire la requête SQL appropriée pour chaque table
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
    
    // Vérifier si l'installation a réussi
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

/**
 * Génère le SQL pour créer une table spécifique
 */
function getCreateTableSql(tableName: string): string | null {
  const sqlQueries: Record<string, string> = {
    users: `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT,
        calendly_url TEXT,
        calendly_sync_email TEXT,
        calendly_enabled BOOLEAN DEFAULT FALSE
      );
    `,
    contacts: `
      CREATE TABLE IF NOT EXISTS public.contacts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        position TEXT,
        address TEXT,
        notes TEXT,
        "assignedTo" UUID REFERENCES public.users(id),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status TEXT NOT NULL DEFAULT 'lead',
        subscription_plan_id UUID,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `,
    appointments: `
      CREATE TABLE IF NOT EXISTS public.appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        "contactId" UUID NOT NULL REFERENCES public.contacts(id),
        "freelancerId" UUID NOT NULL REFERENCES public.users(id),
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL,
        location TEXT,
        notes TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `,
    quotes: `
      CREATE TABLE IF NOT EXISTS public.quotes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "contactId" UUID NOT NULL REFERENCES public.contacts(id),
        "freelancerId" UUID NOT NULL REFERENCES public.users(id),
        "totalAmount" NUMERIC NOT NULL,
        status TEXT NOT NULL,
        "validUntil" TIMESTAMP WITH TIME ZONE NOT NULL,
        notes TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `,
    quote_items: `
      CREATE TABLE IF NOT EXISTS public.quote_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "quoteId" UUID NOT NULL REFERENCES public.quotes(id),
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        "unitPrice" NUMERIC NOT NULL,
        discount NUMERIC,
        tax NUMERIC
      );
    `,
    subscriptions: `
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        interval TEXT NOT NULL,
        "clientId" UUID NOT NULL REFERENCES public.users(id),
        "freelancerId" UUID NOT NULL REFERENCES public.users(id),
        status TEXT NOT NULL,
        "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endDate" TIMESTAMP WITH TIME ZONE,
        "renewalDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `,
    commissions: `
      CREATE TABLE IF NOT EXISTS public.commissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "freelancerId" UUID NOT NULL REFERENCES public.users(id),
        amount NUMERIC NOT NULL,
        tier TEXT NOT NULL,
        "subscriptionId" UUID REFERENCES public.subscriptions(id),
        "quoteId" UUID REFERENCES public.quotes(id),
        "periodStart" TIMESTAMP WITH TIME ZONE NOT NULL,
        "periodEnd" TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT NOT NULL,
        "paidDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `,
    commission_rules: `
      CREATE TABLE IF NOT EXISTS public.commission_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tier TEXT NOT NULL,
        "minContracts" INTEGER NOT NULL,
        percentage NUMERIC NOT NULL
      );
    `
  };

  return sqlQueries[tableName] || null;
}
