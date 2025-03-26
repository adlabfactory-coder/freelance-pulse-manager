
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useDatabaseStatus } from "./useDatabaseStatus";
import { useSupabaseStatus } from "./useSupabaseStatus";
import { useUsersDataLoader } from "./useUsersDataLoader";

export const useSettingsData = () => {
  const { user: currentUser, isAdmin, isSuperAdmin, role, loading: authLoading } = useAuth();
  const { users, loading: usersLoading, error: usersError } = useUsersDataLoader();
  const { dbStatus, checkDatabaseStatus } = useDatabaseStatus();
  const { checkSupabaseStatus } = useSupabaseStatus();
  const [loadingSupabase, setLoadingSupabase] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Vérifie l'état de Supabase et de la base de données au chargement
  useEffect(() => {
    const verifySupabaseConnection = async () => {
      if (isSuperAdmin) {
        setLoadingSupabase(true);
        
        try {
          // Vérifier la connexion à Supabase
          const supabaseStatus = await checkSupabaseStatus();
          
          if (!supabaseStatus.success) {
            setConnectionError(supabaseStatus.message || "Impossible de se connecter à Supabase");
            toast({
              variant: "destructive",
              title: "Erreur de connexion",
              description: supabaseStatus.message || "Impossible de se connecter à Supabase",
            });
            return;
          }
          
          // Vérifier l'état de la base de données
          const dbSetupStatus = await checkDatabaseStatus();
          
          if (!dbSetupStatus.success && dbSetupStatus.missingTables && dbSetupStatus.missingTables.length > 0) {
            toast({
              variant: "default",
              title: "Configuration requise",
              description: "La base de données n'est pas complètement configurée. Accédez à l'onglet Base de données pour initialiser les tables manquantes.",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la vérification de l'état de Supabase:", error);
          setConnectionError("Impossible de vérifier l'état de la connexion Supabase");
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de vérifier l'état de la connexion Supabase",
          });
        } finally {
          setLoadingSupabase(false);
        }
      }
    };

    if (currentUser) {
      verifySupabaseConnection();
    }
  }, [currentUser, isSuperAdmin, checkSupabaseStatus, checkDatabaseStatus]);

  const loading = authLoading || usersLoading || loadingSupabase;
  const error = connectionError || usersError;

  return {
    currentUser,
    users,
    isAdmin,
    isSuperAdmin,
    role,
    loadingUser: loading,
    error,
    dbStatus
  };
};

export default useSettingsData;
