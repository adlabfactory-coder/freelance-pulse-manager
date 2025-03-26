
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseConnection } from './connection';
import { initializeDatabase, checkDatabaseStatus } from './setup';
import { createStorageService } from './storage';
import { createUsersService } from './users';
import { createContactsService } from './contacts';
import { createQuotesService } from './quotes';
import { createCommissionsService } from './commissions';
import { createSubscriptionsService } from './subscriptions';

// Service centralisé pour Supabase
export const createSupabaseService = () => {
  // Créer les services avec le client Supabase
  const storageService = createStorageService(supabase);
  const usersService = createUsersService(supabase);
  const contactsService = createContactsService(supabase);
  const quotesService = createQuotesService(supabase);
  const commissionsService = createCommissionsService(supabase);
  const subscriptionsService = createSubscriptionsService(supabase);

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
    subscriptions: subscriptionsService,
  };
};

export { supabase };
export * from './connection';
export * from './setup';
export * from './types';
