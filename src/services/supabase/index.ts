
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
  return {
    client: supabase,
    checkConnection: checkSupabaseConnection,
    database: {
      initialize: initializeDatabase,
      checkStatus: checkDatabaseStatus,
    },
    storage: createStorageService(supabase),
    users: createUsersService(supabase),
    contacts: createContactsService(supabase),
    quotes: createQuotesService(supabase),
    commissions: createCommissionsService(supabase),
    subscriptions: createSubscriptionsService(supabase),
  };
};

export { supabase };
export * from './connection';
export * from './setup';
export * from './types';
