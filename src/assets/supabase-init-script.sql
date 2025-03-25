
-- Script d'initialisation des tables pour l'application AdLab Hub
-- À copier dans l'éditeur SQL de Supabase

-- Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table users
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

-- Création de la table contacts
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

-- Création de la table appointments
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

-- Création de la table quotes
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

-- Création de la table quote_items
CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "quoteId" UUID NOT NULL REFERENCES public.quotes(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  "unitPrice" NUMERIC NOT NULL,
  discount NUMERIC,
  tax NUMERIC
);

-- Création de la table subscriptions
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

-- Création de la table commissions
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

-- Création de la table commission_rules
CREATE TABLE IF NOT EXISTS public.commission_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier TEXT NOT NULL,
  "minContracts" INTEGER NOT NULL,
  percentage NUMERIC NOT NULL
);

-- Création de la fonction check_table_exists pour vérifier l'existence d'une table
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

-- Insertion de données de démonstration pour les utilisateurs
INSERT INTO public.users (name, email, role, calendly_url, calendly_enabled, calendly_sync_email)
VALUES 
  ('Admin Démo', 'admin@example.com', 'admin', 'https://calendly.com/admin-demo', true, 'admin@example.com'),
  ('Commercial Démo', 'commercial@example.com', 'freelancer', 'https://calendly.com/commercial-demo', true, 'commercial@example.com'),
  ('Client Démo', 'client@example.com', 'client', '', false, '')
ON CONFLICT (email) DO NOTHING;
