
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useSupabaseClient } from "./supabase-context";

interface DatabaseStatus {
  isConnected: boolean;
  tables: TableStatus[];
  lastChecked: Date;
  error: string | null;
}

interface TableStatus {
  name: string;
  exists: boolean;
  count: number;
  error?: string;
}

export const useDatabaseStatus = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    isConnected: false,
    tables: [],
    lastChecked: new Date(),
    error: null
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
    
    checkDbStatus();
  }, []);
  
  const refreshStatus = async () => {
    await checkDbStatus();
  };
  
  return {
    ...status,
    loading,
    refreshStatus
  };
};
