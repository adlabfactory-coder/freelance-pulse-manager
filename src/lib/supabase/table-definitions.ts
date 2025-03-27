// Liste des tables nécessaires pour l'application
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
 * Retourne le SQL nécessaire pour créer une table spécifique
 * @param tableName Nom de la table à créer
 * @returns SQL pour créer la table ou null si non disponible
 */
export const getCreateTableSql = (tableName: string): string | null => {
  // Définir les requêtes SQL pour chaque table
  // Ceci est un placeholder - dans une vraie application, ces définitions
  // seraient plus complètes et correspondraient à la structure exacte des tables
  const tableSql: Record<string, string> = {
    users: `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT
      )
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
        "assignedTo" UUID,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `,
    appointments: `
      CREATE TABLE IF NOT EXISTS public.appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        "contactId" UUID NOT NULL,
        "freelancerId" UUID NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL,
        location TEXT,
        notes TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `,
    quotes: `
      CREATE TABLE IF NOT EXISTS public.quotes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "contactId" UUID NOT NULL,
        "freelancerId" UUID NOT NULL,
        "totalAmount" NUMERIC NOT NULL,
        status TEXT NOT NULL,
        "validUntil" TIMESTAMP WITH TIME ZONE NOT NULL,
        notes TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        folder TEXT DEFAULT 'general'
      )
    `,
    quote_items: `
      CREATE TABLE IF NOT EXISTS public.quote_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "quoteId" UUID NOT NULL,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        "unitPrice" NUMERIC NOT NULL,
        discount NUMERIC,
        tax NUMERIC
      )
    `,
    subscriptions: `
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        interval TEXT NOT NULL,
        "clientId" UUID NOT NULL,
        "freelancerId" UUID NOT NULL,
        status TEXT NOT NULL,
        "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endDate" TIMESTAMP WITH TIME ZONE,
        "renewalDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `,
    commissions: `
      CREATE TABLE IF NOT EXISTS public.commissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "freelancerId" UUID NOT NULL,
        amount NUMERIC NOT NULL,
        tier TEXT NOT NULL,
        "subscriptionId" UUID,
        "quoteId" UUID,
        "periodStart" TIMESTAMP WITH TIME ZONE NOT NULL,
        "periodEnd" TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT NOT NULL,
        "paidDate" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `,
    commission_rules: `
      CREATE TABLE IF NOT EXISTS public.commission_rules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tier TEXT NOT NULL,
        "minContracts" INTEGER NOT NULL,
        percentage NUMERIC NOT NULL
      )
    `
  };
  
  return tableSql[tableName] || null;
};
