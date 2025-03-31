
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

interface TableStatus {
  name: string;
  exists: boolean;
  count: number;
  error?: string;
}

interface DatabaseStatus {
  isConnected: boolean;
  tables: TableStatus[];
  lastChecked: Date;
  error: string | null;
}

type DatabaseSetupStatus = {
  success: boolean;
  missingTables?: string[];
  message: string;
};

interface DatabaseSetupOptions {
  onTableCreated?: (tableName: string) => void;
}

interface TableSetupStatus {
  table: string;
  success: boolean;
  error?: string;
}

interface DatabaseSetupResult {
  success: boolean;
  message: string;
  details?: TableSetupStatus[];
}

export const useDatabaseStatus = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    isConnected: false,
    tables: [],
    lastChecked: new Date(),
    error: null
  });
  const [loading, setLoading] = useState(true);
  
  const checkDbStatus = async () => {
    setLoading(true);
    try {
      // Tester la connexion
      const { data, error } = await supabase.from("users").select("count(*)");
      const isConnected = !error;
      
      let tables: TableStatus[] = [];
      let dbError = null;
      
      if (isConnected) {
        // Liste des tables à vérifier
        const tableNames = [
          "users", "contacts", "quotes", "quote_items", 
          "appointments", "subscriptions", "commissions"
        ];
        
        for (const tableName of tableNames) {
          try {
            const { data: countData, error: countError } = await supabase
              .from(tableName)
              .select("count(*)", { count: "exact" });
            
            tables.push({
              name: tableName,
              exists: !countError,
              count: countData?.[0]?.count || 0,
              error: countError?.message
            });
          } catch (err) {
            tables.push({
              name: tableName,
              exists: false,
              count: 0,
              error: "Erreur lors de la vérification de la table"
            });
          }
        }
      } else {
        dbError = error?.message || "Impossible de se connecter à la base de données";
      }
      
      setStatus({
        isConnected,
        tables,
        lastChecked: new Date(),
        error: dbError
      });
    } catch (err: any) {
      setStatus({
        isConnected: false,
        tables: [],
        lastChecked: new Date(),
        error: err.message || "Une erreur inattendue s'est produite"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkDbStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      const { data, error } = await supabase.from('users').select('id').limit(1);
      return {
        success: !error,
        message: error ? `Erreur de connexion: ${error.message}` : 'Connexion à Supabase établie'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erreur: ${err.message || 'Inconnue'}`
      };
    }
  };
  
  const checkDatabaseStatus = async (): Promise<DatabaseSetupStatus> => {
    try {
      const tableNames = [
        "users", "contacts", "quotes", "quote_items", 
        "appointments", "subscriptions", "commissions"
      ];
      
      const tableChecks = await Promise.all(
        tableNames.map(async (table) => {
          try {
            const { error } = await supabase.from(table).select('id').limit(1);
            return { table, exists: !error || error.code !== '42P01' };
          } catch (err) {
            return { table, exists: false };
          }
        })
      );
      
      const missingTables = tableChecks.filter(r => !r.exists).map(r => r.table);
      
      return {
        success: missingTables.length === 0,
        missingTables,
        message: missingTables.length > 0 
          ? `Tables manquantes: ${missingTables.join(', ')}` 
          : 'Toutes les tables sont correctement configurées'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erreur: ${error.message || 'Inconnue'}`
      };
    }
  };

  const initializeDatabase = async (options?: DatabaseSetupOptions): Promise<DatabaseSetupResult> => {
    try {
      const status = await checkDatabaseStatus();
      
      if (status.success) {
        return { 
          success: true, 
          message: 'La base de données est correctement configurée' 
        };
      }
      
      // Cette fonction serait complète avec la création des tables manquantes
      // mais nous la laissons simplifiée pour cet exemple
      return {
        success: false,
        message: 'Des tables sont manquantes. Contactez l\'administrateur.'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erreur d'initialisation: ${error.message || 'Inconnue'}`
      };
    }
  };
  
  return {
    ...status,
    loading,
    refreshStatus: checkDbStatus,
    checkSupabaseStatus,
    checkDatabaseStatus,
    initializeDatabase
  };
};
