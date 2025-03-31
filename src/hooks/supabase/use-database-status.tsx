
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { tableNames } from "@/services/supabase/setup/database-status";
import { toast } from "@/components/ui/use-toast";
import { checkDatabaseStatus as checkDbStatus, initializeDatabase as initDb } from "@/services/supabase/setup";

export type TableStatus = {
  table: string;
  exists: boolean;
};

export type DatabaseStatusType = "ok" | "partial" | "not_configured" | "connection_error" | "unknown" | "loading";

export function useDatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatusType>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [tablesStatus, setTablesStatus] = useState<TableStatus[]>([]);

  const checkTableExists = useCallback(async (tableName: string): Promise<boolean> => {
    try {
      // Try with RPC function first
      try {
        const { data, error } = await supabase.rpc('check_table_exists', { table_name: tableName });
        if (!error) {
          return !!data;
        }
      } catch (rpcError) {
        // Fall back to direct query if RPC not available
      }
      
      // Try direct query as fallback
      const { error } = await supabase.from(tableName).select('id').limit(1);
      return !error || error.code !== '42P01'; // 42P01 is 'relation does not exist'
    } catch (err) {
      console.error(`Error checking if table ${tableName} exists:`, err);
      return false;
    }
  }, []);

  const checkDatabaseStatus = useCallback(async () => {
    try {
      // Check all required tables
      const results = await Promise.all(
        tableNames.map(async (tableName) => ({
          table: tableName,
          exists: await checkTableExists(tableName)
        }))
      );
      
      setTablesStatus(results);
      
      // Determine overall status
      const missingTables = results.filter(r => !r.exists);
      if (missingTables.length === 0) {
        setStatus("ok");
      } else if (missingTables.length < tableNames.length) {
        setStatus("partial");
      } else {
        setStatus("not_configured");
      }
      
      setConnectionError(null);

      // Return status information for external use
      return {
        success: missingTables.length === 0,
        tables: missingTables.map(t => t.table),
        message: missingTables.length === 0 
          ? 'Toutes les tables sont configurées' 
          : `Tables manquantes: ${missingTables.map(t => t.table).join(', ')}`
      };
    } catch (err: any) {
      console.error("Error checking database status:", err);
      setConnectionError(err.message || "Une erreur est survenue lors de la vérification des tables");
      setStatus("unknown");
      
      return {
        success: false,
        message: err.message || "Une erreur est survenue lors de la vérification des tables"
      };
    }
  }, [checkTableExists]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Check Supabase connection first
    try {
      // Try to access the users table to verify connection
      const { data, error } = await supabase.from('users').select('id').limit(1);
      
      if (error) {
        setConnectionError("Impossible de se connecter à Supabase");
        setStatus("connection_error");
        setTablesStatus([]);
        setRefreshing(false);
        return {
          success: false,
          message: "Impossible de se connecter à Supabase"
        };
      }
      
      // If connection is successful, check database status
      const statusResult = await checkDatabaseStatus();
      return statusResult;
    } catch (error: any) {
      console.error("Error during refresh:", error);
      setConnectionError(error.message || "Erreur lors de la vérification de la connexion");
      setStatus("connection_error");
      
      return {
        success: false,
        message: error.message || "Erreur lors de la vérification de la connexion"
      };
    } finally {
      setRefreshing(false);
    }
  }, [checkDatabaseStatus]);

  // Add these methods to expose them for the provider
  const checkSupabaseStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      
      if (error) {
        console.warn('Erreur lors de la vérification de la connexion à Supabase:', error.message);
        return { success: false, message: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la connexion à Supabase:', error);
      return { success: false, message: 'Impossible de se connecter à Supabase' };
    }
  }, []);

  const initializeDatabase = useCallback(async (options: any = {}) => {
    try {
      return await initDb(options);
    } catch (error: any) {
      console.error("Error initializing database:", error);
      return { 
        success: false, 
        message: `Erreur lors de l'initialisation de la base de données: ${error.message || "Erreur inconnue"}` 
      };
    }
  }, []);

  // Initial check
  useEffect(() => {
    const initialCheck = async () => {
      setIsLoading(true);
      await handleRefresh();
      setIsLoading(false);
    };
    
    initialCheck();
  }, [handleRefresh]);

  return {
    status,
    isLoading,
    refreshing,
    connectionError,
    tablesStatus,
    handleRefresh,
    // Add these methods to be exposed to the provider
    checkSupabaseStatus,
    checkDatabaseStatus,
    initializeDatabase
  };
}

export default useDatabaseStatus;
