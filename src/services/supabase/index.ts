
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseConnection } from './connection';
import { initializeDatabase, checkDatabaseStatus } from './setup';
import { createStorageService } from './storage';
import { createUsersService } from './users';
import { createContactsService } from './contacts';
import { createQuotesService } from './quotes';
import { createCommissionsService } from './commissions';

// Service centralisé pour Supabase
export const createSupabaseService = () => {
  // Création des services avec des types génériques pour éviter les erreurs de compatibilité
  const storageService = createStorageService(supabase as any);
  const usersService = createUsersService(supabase as any);
  const contactsService = createContactsService(supabase as any);
  const quotesService = createQuotesService(supabase as any);
  const commissionsService = createCommissionsService(supabase as any);

  return {
    client: supabase,
    checkConnection: checkSupabaseConnection,
    database: {
      initialize: initializeDatabase,
      checkStatus: checkDatabaseStatus,
    },
    storage: storageService,
    users: usersService,
    contacts: contactsService,
    quotes: quotesService,
    commissions: commissionsService,
  };
};

export { supabase };
export * from './connection';
export * from './setup';
export * from './types';
