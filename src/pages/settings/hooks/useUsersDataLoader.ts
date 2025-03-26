
import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";
import { getMockUsers } from "@/utils/supabase-mock-data";

export const useUsersDataLoader = () => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Récupération des utilisateurs...");
      
      // Tentative de récupération depuis Supabase
      try {
        const allUsers = await supabase.fetchUsers();
        console.log("Utilisateurs récupérés:", allUsers);
        setUsers(allUsers);
      } catch (e) {
        console.error("Erreur de récupération depuis Supabase:", e);
        
        // Si on a une fonction de mock, on l'utilise en fallback
        const mockUsers = getMockUsers();
        console.log("Utilisateurs mockés:", mockUsers);
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, loadUsers };
};

export default useUsersDataLoader;
