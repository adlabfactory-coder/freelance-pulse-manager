
import { User, UserRole } from '@/types';

export interface DatabaseConnectionStatus {
  success: boolean;
  message: string;
  needsSetup?: boolean;
  networkError?: boolean;
}

export interface DatabaseSetupStatus {
  success: boolean;
  missingTables?: string[];
  message?: string;
}

export interface DatabaseSetupResult {
  success: boolean;
  message: string;
  details?: any[];
}

export interface TableSetupStatus {
  table: string;
  success: boolean;
  error?: string;
}

export interface DatabaseSetupOptions {
  onTableCreated?: (tableName: string) => void;
}
