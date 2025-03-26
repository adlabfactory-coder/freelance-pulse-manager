
import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

const useUsersDataLoader = () => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  const loadUsers = useCallback(async () => {
    // Si déjà tenté plusieurs fois, ne pas retenter infiniment
    if (loadAttempt > 2) {
      console.log("📊 Trop de tentatives de chargement, utilisation des données en cache");
      setLoading(false);
      return;
    }
    
    setLoadAttempt(prev => prev + 1);
    setLoading(true);
    setError(null);
    
    try {
      console.log("📊 Démarrage de la récupération des utilisateurs...");
      
      // Ne garder que l'admin et le super admin dans les données mockées
      const mockUsers = supabase.getMockUsers().filter(user => 
        user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
      );
      
      console.log("✅ Données mockées récupérées:", mockUsers);
      setUsers(mockUsers);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Erreur fatale lors du chargement des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, loadAttempt]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, loadUsers, lastUpdated };
};

export default useUsersDataLoader;
// Add a named export as well for compatibility
export { useUsersDataLoader };
