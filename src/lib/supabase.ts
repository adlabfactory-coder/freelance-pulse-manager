
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://cvgwwdwnfmnkiyxqfmnn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Fonction pour vérifier l'état de la connexion Supabase de manière robuste
export const checkSupabaseConnection = async () => {
  try {
    // On essaie d'abord une opération simple qui ne dépend pas d'une table spécifique
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur de connexion à Supabase (auth):', authError.message);
      return { success: false, message: 'Erreur de connexion à Supabase: ' + authError.message };
    }
    
    // On vérifie également que les tables sont accessibles en essayant d'accéder à une table courante
    try {
      const { error: tableError } = await supabase.from('contacts').select('id').limit(1);
      
      if (tableError && tableError.code === '42P01') { // Code pour "relation does not exist"
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
      // On ne fait pas échouer la vérification complète si seulement les tables sont inaccessibles
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

// Fonction pour vérifier si la base de données est correctement configurée
export const checkDatabaseSetup = async () => {
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

interface SetupDatabaseOptions {
  onTableCreated?: (tableName: string) => void;
}

// Fonction pour créer les tables manquantes dans Supabase
export const setupDatabase = async (options?: SetupDatabaseOptions) => {
  try {
    // Vérifier d'abord quelles tables sont manquantes
    const dbStatus = await checkDatabaseSetup();
    
    if (dbStatus.success) {
      return { success: true, message: 'La base de données est déjà correctement configurée' };
    }
    
    const results = [];
    
    // Fonction d'aide pour notifier de la création d'une table
    const notifyTableCreated = (tableName: string) => {
      if (options?.onTableCreated) {
        options.onTableCreated(tableName);
      }
    };
    
    // Activation de l'extension UUID si nécessaire
    await supabase.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    // Création de la table users si elle n'existe pas
    if (dbStatus.missingTables.includes('users')) {
      const { error: usersError } = await supabase.query(`
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
      `);
      
      if (!usersError) {
        notifyTableCreated('users');
        results.push({ table: 'users', success: true });
      } else {
        results.push({ table: 'users', success: false, error: usersError.message });
      }
    }
    
    // Création de la table contacts si elle n'existe pas
    if (dbStatus.missingTables.includes('contacts')) {
      const { error } = await supabase.query(`
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
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (!error) {
        notifyTableCreated('contacts');
        results.push({ table: 'contacts', success: true });
      } else {
        results.push({ table: 'contacts', success: false, error: error.message });
      }
    }
    
    // Création de la table appointments si elle n'existe pas
    if (dbStatus.missingTables.includes('appointments')) {
      const { error } = await supabase.query(`
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
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (!error) {
        notifyTableCreated('appointments');
        results.push({ table: 'appointments', success: true });
      } else {
        results.push({ table: 'appointments', success: false, error: error.message });
      }
    }
    
    // Création de la table quotes si elle n'existe pas
    if (dbStatus.missingTables.includes('quotes')) {
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.quotes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "contactId" UUID NOT NULL REFERENCES public.contacts(id),
          "freelancerId" UUID NOT NULL REFERENCES public.users(id),
          "totalAmount" NUMERIC NOT NULL,
          status TEXT NOT NULL,
          "validUntil" TIMESTAMP WITH TIME ZONE NOT NULL,
          notes TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (!error) {
        notifyTableCreated('quotes');
        results.push({ table: 'quotes', success: true });
      } else {
        results.push({ table: 'quotes', success: false, error: error.message });
      }
    }
    
    // Création de la table quote_items si elle n'existe pas
    if (dbStatus.missingTables.includes('quote_items')) {
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.quote_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "quoteId" UUID NOT NULL REFERENCES public.quotes(id),
          description TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          "unitPrice" NUMERIC NOT NULL,
          discount NUMERIC,
          tax NUMERIC
        );
      `);
      
      if (!error) {
        notifyTableCreated('quote_items');
        results.push({ table: 'quote_items', success: true });
      } else {
        results.push({ table: 'quote_items', success: false, error: error.message });
      }
    }
    
    // Création de la table subscriptions si elle n'existe pas
    if (dbStatus.missingTables.includes('subscriptions')) {
      const { error } = await supabase.query(`
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
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (!error) {
        notifyTableCreated('subscriptions');
        results.push({ table: 'subscriptions', success: true });
      } else {
        results.push({ table: 'subscriptions', success: false, error: error.message });
      }
    }
    
    // Création de la table commissions si elle n'existe pas
    if (dbStatus.missingTables.includes('commissions')) {
      const { error } = await supabase.query(`
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
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      if (!error) {
        notifyTableCreated('commissions');
        results.push({ table: 'commissions', success: true });
      } else {
        results.push({ table: 'commissions', success: false, error: error.message });
      }
    }
    
    // Création de la table commission_rules si elle n'existe pas
    if (dbStatus.missingTables.includes('commission_rules')) {
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.commission_rules (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          tier TEXT NOT NULL,
          "minContracts" INTEGER NOT NULL,
          percentage NUMERIC NOT NULL
        );
      `);
      
      if (!error) {
        notifyTableCreated('commission_rules');
        results.push({ table: 'commission_rules', success: true });
      } else {
        results.push({ table: 'commission_rules', success: false, error: error.message });
      }
    }
    
    // Insérer des données initiales dans la table users si elle a été créée avec succès
    if (results.find(r => r.table === 'users')?.success) {
      // Vérifier si des utilisateurs existent déjà
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
        
      if (!checkError && (!existingUsers || existingUsers.length === 0)) {
        // Insérer des utilisateurs de démonstration
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              name: "Admin Démo",
              email: "admin@example.com",
              role: "admin",
              calendly_url: "https://calendly.com/admin-demo",
              calendly_enabled: true,
              calendly_sync_email: "admin@example.com"
            },
            {
              name: "Commercial Démo",
              email: "commercial@example.com",
              role: "freelancer",
              calendly_url: "https://calendly.com/commercial-demo",
              calendly_enabled: true,
              calendly_sync_email: "commercial@example.com"
            },
            {
              name: "Client Démo",
              email: "client@example.com",
              role: "client",
              calendly_url: "",
              calendly_enabled: false,
              calendly_sync_email: ""
            }
          ]);
          
        if (insertError) {
          console.error('Erreur lors de l\'insertion des utilisateurs de démonstration:', insertError);
        } else {
          notifyTableCreated('Utilisateurs de démonstration');
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
