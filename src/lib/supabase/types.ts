
export interface DatabaseSetupStatus {
  success: boolean;
  missingTables?: string[];
  message: string;
}

export interface TableSetupStatus {
  table: string;
  success: boolean;
  error?: string;
}

export interface DatabaseSetupResult {
  success: boolean;
  message: string;
  details?: TableSetupStatus[];
}

export interface DatabaseSetupOptions {
  onTableCreated?: (tableName: string) => void;
}

export interface DatabaseConnectionStatus {
  success: boolean;
  message?: string;
  networkError?: boolean;
  needsSetup?: boolean;
  partialConnection?: boolean;
}
