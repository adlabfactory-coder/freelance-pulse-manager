
import { useState, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";

export const useDatabaseStatus = () => {
  const supabase = useSupabase();
  const [dbStatus, setDbStatus] = useState<{
    success: boolean;
    missingTables?: string[];
    message?: string;
  } | null>(null);
  
  const checkDatabaseStatus = useCallback(async () => {
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
    dbStatus,
    checkDatabaseStatus
  };
};
