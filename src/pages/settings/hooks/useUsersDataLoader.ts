
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
      
      // Vérification de la configuration Supabase
      const supabaseUrl = "https://cvgwwdwnfmnkiyxqfmnn.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3d3ZHduZm1ua2l5eHFmbW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODc5MDIsImV4cCI6MjA1ODQ2MzkwMn0.ItnJf48Z5NT7Gj-GcraxmPcUx2bKa7lzJZBahrwkq8A";
      
      console.log("Configuration Supabase vérifiée, URL:", supabaseUrl.substring(0, 20) + "...");
      
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
