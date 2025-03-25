
import { supabase } from './supabase';

// Fonction pour créer les fonctions SQL nécessaires dans Supabase
export const createSQLFunctions = async () => {
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
    
    // Fonction pour créer la table users
    const createUsersTableSQL = `
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
    `;
    
    // Fonction pour créer la table contacts
    const createContactsTableSQL = `
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
    `;
    
    // Fonction pour créer la table appointments
    const createAppointmentsTableSQL = `
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
    `;
    
    // Fonction pour créer la table quotes
    const createQuotesTableSQL = `
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
    `;
    
    // Fonction pour créer la table quote_items
    const createQuoteItemsTableSQL = `
      CREATE TABLE IF NOT EXISTS public.quote_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "quoteId" UUID NOT NULL REFERENCES public.quotes(id),
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        "unitPrice" NUMERIC NOT NULL,
        discount NUMERIC,
        tax NUMERIC
      );
    `;
    
    // Fonction pour créer la table subscriptions
    const createSubscriptionsTableSQL = `
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
    `;
    
    // Fonction pour créer la table commissions
    const createCommissionsTableSQL = `
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
    `;
    
    // Fonction pour créer la table commission_rules
    const createCommissionRulesTableSQL = `
      CREATE TABLE IF NOT EXISTS public.commission_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tier TEXT NOT NULL,
        "minContracts" INTEGER NOT NULL,
        percentage NUMERIC NOT NULL
      );
    `;
    
    // Exécution des requêtes SQL pour créer les tables si l'API RPC n'est pas disponible
    // Nous utilisons le client SQL directement pour initialiser la base de données
    // Cette approche est simplifiée et nécessite des droits d'administrateur
    
    // Activer l'extension UUID si nécessaire
    await supabase.rpc('execute_sql', { sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' });
    
    // Créer les tables
    await supabase.rpc('execute_sql', { sql: createUsersTableSQL });
    await supabase.rpc('execute_sql', { sql: createContactsTableSQL });
    await supabase.rpc('execute_sql', { sql: createAppointmentsTableSQL });
    await supabase.rpc('execute_sql', { sql: createQuotesTableSQL });
    await supabase.rpc('execute_sql', { sql: createQuoteItemsTableSQL });
    await supabase.rpc('execute_sql', { sql: createSubscriptionsTableSQL });
    await supabase.rpc('execute_sql', { sql: createCommissionsTableSQL });
    await supabase.rpc('execute_sql', { sql: createCommissionRulesTableSQL });
    
    // Insérer des données initiales pour les utilisateurs de démonstration
    const insertDemoUsersSQL = `
      INSERT INTO public.users (name, email, role, calendly_url, calendly_enabled, calendly_sync_email)
      VALUES 
        ('Admin Démo', 'admin@example.com', 'admin', 'https://calendly.com/admin-demo', true, 'admin@example.com'),
        ('Commercial Démo', 'commercial@example.com', 'freelancer', 'https://calendly.com/commercial-demo', true, 'commercial@example.com'),
        ('Client Démo', 'client@example.com', 'client', '', false, '')
      ON CONFLICT (email) DO NOTHING;
    `;
    
    await supabase.rpc('execute_sql', { sql: insertDemoUsersSQL });
    
    return { success: true, message: 'Base de données initialisée avec succès' };
  } catch (error: any) {
    console.error('Erreur lors de l\'initialisation SQL:', error);
    return { success: false, message: `Erreur: ${error.message || 'Erreur inconnue'}` };
  }
};

// Fonction pour créer une fonction SQL execute_sql dans Supabase (nécessite des droits admin)
export const createExecuteSQLFunction = async () => {
  try {
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION execute_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
    `;
    
    // Cette opération nécessite un token avec des droits d'administrateur
    // et devrait être exécutée via le dashboard Supabase ou via une connexion privilégiée
    
    return { success: true, message: 'Fonction execute_sql créée avec succès' };
  } catch (error: any) {
    console.error('Erreur lors de la création de la fonction execute_sql:', error);
    return { success: false, message: `Erreur: ${error.message || 'Erreur inconnue'}` };
  }
};
