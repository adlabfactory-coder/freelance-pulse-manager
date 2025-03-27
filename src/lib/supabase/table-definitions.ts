
import { TableName } from './types';

// Array of required table names
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

// Map of table names to their SQL creation scripts
export const SQL_CREATE_TABLE_QUERIES: Record<string, string> = {
  users: `
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      schedule_enabled BOOLEAN DEFAULT FALSE,
      daily_availability JSONB,
      weekly_availability JSONB,
      supervisor_id UUID
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

/**
 * Gets the SQL for creating a specific table
 */
export function getCreateTableSql(tableName: string): string | null {
  return SQL_CREATE_TABLE_QUERIES[tableName] || null;
}
