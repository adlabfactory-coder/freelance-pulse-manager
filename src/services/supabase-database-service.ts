
import { 
  checkDatabaseSetup, 
  checkSupabaseConnection, 
  setupDatabase 
} from '@/lib/supabase-setup';
import { DatabaseSetupOptions } from '@/types/supabase-types';

// Method to check Supabase connection status
export const checkSupabaseStatus = async () => {
  const connectionStatus = await checkSupabaseConnection();
  return connectionStatus;
};

// Method to check database configuration
export const checkDatabaseStatus = async () => {
  const dbStatus = await checkDatabaseSetup();
  return dbStatus;
};

// Method to initialize the database
export const initializeDatabase = async (options?: DatabaseSetupOptions) => {
  const setupResult = await setupDatabase(options);
  return setupResult;
};
