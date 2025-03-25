
import { checkDatabaseSetup, checkSupabaseConnection, setupDatabase } from '@/lib/supabase';
import { DatabaseSetupOptions } from '@/types/supabase-types';

// Ajout d'une méthode pour vérifier l'état de la configuration Supabase
export const checkSupabaseStatus = async () => {
  const connectionStatus = await checkSupabaseConnection();
  return connectionStatus;
};

// Ajout d'une méthode pour vérifier la configuration de la base de données
export const checkDatabaseStatus = async () => {
  const dbStatus = await checkDatabaseSetup();
  return dbStatus;
};

// Ajout d'une méthode pour initialiser la base de données
export const initializeDatabase = async (options?: DatabaseSetupOptions) => {
  const setupResult = await setupDatabase(options);
  return setupResult;
};
