import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";

export type TableStatus = {
  table: string;
  exists: boolean;
};

export type DatabaseStatusType = "ok" | "partial" | "not_configured" | "connection_error" | "unknown" | "loading";

export function useDatabaseStatus() {
  const supabase = useSupabase();
  const [status, setStatus] = useState<DatabaseStatusType>("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [tablesStatus, setTablesStatus] = useState<TableStatus[]>([]);

  const checkDatabaseStatus = useCallback(async () => {
    try {
      const dbStatus = await supabase.checkDatabaseStatus();
      
      // Process missing tables from either property (missingTables or tables)
      const missingTablesList = dbStatus.missingTables || dbStatus.tables || [];
      
      // Convert tables list to TableStatus format
      const tablesStatusData = missingTablesList.map(table => ({
        table,
        exists: dbStatus.success || (missingTablesList.indexOf(table) === -1)
      }));
      
      setTablesStatus(tablesStatusData);
      
      // Determine overall status
      if (dbStatus.success) {
        setStatus("ok");
      } else if (missingTablesList.length > 0) {
        setStatus("partial");
      } else {
        setStatus("not_configured");
      }
      
      setConnectionError(null);
    } catch (err: any) {
      console.error("Error checking database status:", err);
      setConnectionError(err.message || "Une erreur est survenue lors de la vérification des tables");
      setStatus("unknown");
    }
  }, [supabase]);

  const handleRefresh = useCallback(async () => {
    try {
      console.log("Vérification de la configuration de la base de données...");
      const dbSetupStatus = await supabase.checkDatabaseStatus();
      setDbStatus(dbSetupStatus);
      
      if (!dbSetupStatus.success && dbSetupStatus.missingTables && dbSetupStatus.missingTables.length > 0) {
        console.warn("Tables manquantes dans la base de données:", dbSetupStatus.missingTables);
      }
      
      return dbSetupStatus;
    } catch (dbError) {
      console.error("Erreur lors de la vérification de la base de données:", dbError);
      return {
        success: false,
        message: "Erreur lors de la vérification de la configuration de la base de données"
      };
    }
  }, [supabase]);

  return {
    status,
    isLoading,
    refreshing,
    connectionError,
    tablesStatus,
    handleRefresh: checkDatabaseStatus
  };
}

export default useDatabaseStatus;
