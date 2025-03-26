
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";

export type TableStatus = {
  table: string;
  exists: boolean;
};

export type DatabaseStatus = "ok" | "partial" | "not_configured" | "connection_error" | "unknown" | "loading";

export const useDatabaseStatus = () => {
  const supabase = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [tablesStatus, setTablesStatus] = useState<TableStatus[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const fetchStatus = async () => {
    setIsLoading(true);
    setConnectionError(null);

    try {
      const tables = [
        'users', 
        'contacts', 
        'appointments', 
        'quotes', 
        'quote_items',
        'subscriptions', 
        'commissions', 
        'commission_rules'
      ];
      
      try {
        // Vérifier la connexion d'abord
        const connectionStatus = await supabase.checkSupabaseStatus();
        
        if (!connectionStatus.success) {
          setConnectionError(connectionStatus.message || "Impossible de se connecter à Supabase");
          setTablesStatus(tables.map(table => ({ table, exists: false })));
          setIsLoading(false);
          return;
        }
        
        // Si la connexion est établie, vérifier les tables
        const dbStatus = await supabase.checkDatabaseStatus();
        
        if (dbStatus.success) {
          // Toutes les tables existent
          setTablesStatus(tables.map(table => ({ table, exists: true })));
        } else if (dbStatus.missingTables) {
          // Certaines tables sont manquantes
          setTablesStatus(tables.map(table => ({
            table, 
            exists: !dbStatus.missingTables?.includes(table)
          })));
        } else {
          // Échec de la vérification
          setTablesStatus(tables.map(table => ({ table, exists: false })));
        }
      } catch (error: any) {
        console.error("Erreur lors de la vérification des tables:", error);
        setConnectionError(error.message || "Erreur lors de la vérification des tables");
        setTablesStatus(tables.map(table => ({ table, exists: false })));
      }
    } catch (error) {
      console.error("Erreur générale:", error);
      setConnectionError("Erreur inattendue lors de la vérification de la base de données");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStatus();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  };
  
  const getOverallStatus = (): DatabaseStatus => {
    if (isLoading) return "loading";
    if (connectionError) return "connection_error";
    if (tablesStatus.length === 0) return "unknown";
    
    const missingTables = tablesStatus.filter(t => !t.exists);
    if (missingTables.length === 0) return "ok";
    if (missingTables.length === tablesStatus.length) return "not_configured";
    return "partial";
  };
  
  return {
    tablesStatus,
    isLoading,
    refreshing,
    connectionError,
    status: getOverallStatus(),
    handleRefresh
  };
};

export default useDatabaseStatus;
