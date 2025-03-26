
// Main Supabase export file
// This file re-exports all Supabase-related functionality to maintain compatibility

export { supabase } from './supabase/supabase-client';
export { checkSupabaseConnection } from './supabase-connection';
export { 
  checkDatabaseSetup, 
  setupDatabase,
  tableNames,
  getCreateTableSql
} from './supabase/index';
export { createDatabaseFunctions } from './supabase-functions';
export type {
  DatabaseConnectionStatus,
  DatabaseSetupStatus,
  DatabaseSetupResult,
  TableSetupStatus,
  DatabaseSetupOptions
} from './supabase/types';
