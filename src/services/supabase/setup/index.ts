
/**
 * Database setup module - Entry point
 * This file re-exports all database setup functionality
 */

export { checkDatabaseStatus } from './database-status';
export { initializeDatabase } from './database-initialization';
export { enableRealtimeForTables } from './enable-realtime';
export type { 
  DatabaseSetupOptions, 
  DatabaseSetupResult, 
  DatabaseSetupStatus, 
  TableSetupStatus 
} from '../types';
