
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
      
      setUsers(filteredUsers);
      console.log("✅ Utilisateurs chargés:", filteredUsers.length);
      
      // Vérifier la connexion à la base de données
      try {
        const status = await supabase.checkSupabaseStatus();
        setDbStatus({ 
          isConnected: status.success, 
          message: status.message || "Connexion établie" 
        });
      } catch (e) {
        console.error("❌ Erreur lors de la vérification de la connexion:", e);
        setDbStatus({ 
          isConnected: false, 
          message: "Impossible de vérifier la connexion à la base de données" 
        });
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error);
      setError("Impossible de charger les données utilisateur");
    } finally {
      setLoadingUser(false);
    }
  }, [isAdmin, isSuperAdmin, supabase]);

  // Chargement initial des données - avec limitation à une seule tentative
  useEffect(() => {
    // Limiter à 1 tentative maximum
    if (loadAttempt === 0) {
      loadUsers();
      setLoadAttempt(1);
    }
  }, [loadUsers, loadAttempt]);

  return {
    currentUser,
    users,
    isAdmin,
    isSuperAdmin,
    isAccountManager,
    loadingUser,
    error,
    dbStatus,
    reloadUsers: loadUsers
  };
};

export default useSettingsData;
