
/**
 * Statut de connexion à la base de données
 */
export interface DatabaseConnectionStatus {
  success: boolean;
  message: string;
  needsSetup?: boolean;
  networkError?: boolean;
  partialConnection?: boolean;
}

/**
 * Statut de la configuration de la base de données
 */
export interface DatabaseSetupStatus {
  success: boolean;
  missingTables?: string[];
  message?: string;
}

/**
 * Résultat de l'initialisation de la base de données
 */
export interface DatabaseSetupResult {
  success: boolean;
  message: string;
  details?: any[];
}

/**
 * Statut de la création d'une table
 */
export interface TableSetupStatus {
  table: string;
  success: boolean;
  error?: string;
}

/**
 * Options pour l'initialisation de la base de données
 */
export interface DatabaseSetupOptions {
  onTableCreated?: (tableName: string) => void;
}

/**
 * Type générique pour les réponses des services
 */
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
