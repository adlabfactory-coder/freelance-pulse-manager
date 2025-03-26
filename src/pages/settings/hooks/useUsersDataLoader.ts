
import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User, UserRole } from "@/types";
import { getMockUsers } from "@/utils/supabase-mock-data";
import { toast } from "@/components/ui/use-toast";

export const useUsersDataLoader = () => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Récupération des utilisateurs...");
      
      // Tentative de récupération depuis Supabase
      try {
        const allUsers = await supabase.fetchUsers();
        console.log("Utilisateurs récupérés:", allUsers);
        
        if (allUsers && allUsers.length > 0) {
          setUsers(allUsers);
        } else {
          throw new Error("Aucun utilisateur trouvé dans Supabase");
        }
      } catch (e) {
        console.error("Erreur de récupération depuis Supabase:", e);
        
        // Si on a une fonction de mock, on l'utilise en fallback
        const mockUsers = getMockUsers();
        console.log("Fallback avec utilisateurs mockés:", mockUsers);
        setUsers(mockUsers);
        
        // N'afficher un toast que si ce n'est pas une erreur de connexion
        if (e instanceof Error && !e.message.includes("connexion")) {
          toast({
            title: "Mode démonstration",
            description: "Utilisation des données de démonstration pour les utilisateurs.",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, loadUsers };
};

export default useUsersDataLoader;
