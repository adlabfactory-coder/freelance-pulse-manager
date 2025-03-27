
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";
import { UserRole, hasMinimumRole } from "@/types/roles";
import { toast } from "@/components/ui/use-toast";

const useSettingsData = () => {
  const { user: currentUser, isAdmin, isSuperAdmin, role } = useAuth();
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState({ isConnected: false, message: "" });
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Vérifie si l'utilisateur a au moins le rôle d'account manager
  const isAccountManager = role && hasMinimumRole(role as UserRole, UserRole.ACCOUNT_MANAGER);

  const loadUsers = useCallback(async () => {
    if (!isAdmin && !isSuperAdmin) {
      setLoadingUser(false);
      return;
    }

    setLoadingUser(true);
    setError(null);
    
    try {
      console.log("📊 Chargement des utilisateurs...");
      
      // Ne garder que l'admin et le super admin
      const filteredUsers = supabase.getMockUsers().filter(user => 
        user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
      );
      
      console.log("✅ Utilisateurs mockés filtrés:", filteredUsers);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoadingUser(false);
    }
  }, [isAdmin, isSuperAdmin, supabase]);

  const checkDatabaseStatus = useCallback(async () => {
    try {
      const result = await supabase.checkSupabaseStatus();
      setDbStatus({
        isConnected: result.success,
        message: result.message || ""
      });
    } catch (error) {
      console.error("Erreur lors de la vérification de la connexion à la base de données:", error);
      setDbStatus({
        isConnected: false,
        message: "Erreur de connexion à la base de données"
      });
    }
  }, [supabase]);

  // Charger les données au montage
  useEffect(() => {
    loadUsers();
    checkDatabaseStatus();
  }, [loadUsers, checkDatabaseStatus]);

  return {
    currentUser,
    users,
    loadingUser,
    error,
    dbStatus,
    isAdmin,
    isSuperAdmin,
    isAccountManager,
    refreshUsers: loadUsers,
    refreshDbStatus: checkDatabaseStatus
  };
};

export default useSettingsData;
