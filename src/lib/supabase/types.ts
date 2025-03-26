
import { Database } from '@/types/database';

// Define the type of table names in the database
export type TableName = keyof Database['public']['Tables'];

// Database connection status interface
export interface DatabaseConnectionStatus {
  success: boolean;
  message: string;
  needsSetup?: boolean;
  networkError?: boolean;
}

// Database setup status interface
export interface DatabaseSetupStatus {
  success: boolean;
  missingTables?: string[];
  message?: string;
}

// Database setup result interface
export interface DatabaseSetupResult {
  success: boolean;
  message: string;
  details?: any[];
}

// Table setup status interface
export interface TableSetupStatus {
  table: string;
  success: boolean;
  error?: string;
}

// Database setup options interface
export interface DatabaseSetupOptions {
  onTableCreated?: (tableName: string) => void;
}
