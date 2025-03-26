
// Index file to re-export all supabase functionality

// Re-export client
export { supabase } from './supabase-client';

// Re-export types
export type {
  DatabaseConnectionStatus,
  DatabaseSetupStatus,
  DatabaseSetupResult,
  TableSetupStatus,
  DatabaseSetupOptions
} from './types';

// Re-export database checks and setup
export { checkDatabaseSetup } from './check-database';
export { setupDatabase } from './setup-database';
export { tableNames, getCreateTableSql } from './table-definitions';
