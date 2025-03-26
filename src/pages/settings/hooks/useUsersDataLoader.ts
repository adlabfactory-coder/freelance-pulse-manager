
import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

const useUsersDataLoader = () => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("📊 Démarrage de la récupération des utilisateurs...");
      
      // Validation de la configuration Supabase
      const isSupabaseConfigured = supabase && typeof supabase.fetchUsers === 'function';
      if (!isSupabaseConfigured) {
        console.error("❌ Client Supabase non configuré correctement");
        throw new Error("La configuration Supabase n'est pas valide");
      }
      
      console.log("✅ Configuration Supabase vérifiée");
      
      // Tentative de récupération depuis Supabase
      try {
        console.log("🔄 Appel de la fonction fetchUsers...");
        const allUsers = await supabase.fetchUsers();
        console.log(`✅ Récupération réussie: ${allUsers ? allUsers.length : 0} utilisateurs trouvés`);
        
        if (allUsers && allUsers.length > 0) {
          setUsers(allUsers);
          setLastUpdated(new Date());
        } else {
          console.warn("⚠️ Aucun utilisateur trouvé, utilisation des données de démonstration");
          throw new Error("Aucun utilisateur trouvé dans la base de données");
        }
      } catch (e) {
        console.error("❌ Erreur de récupération depuis Supabase:", e);
        
        // Récupérer les données mockées en fallback si disponibles
        if (supabase.getMockUsers) {
          console.log("🔄 Tentative de fallback avec les données mockées...");
          const mockUsers = supabase.getMockUsers();
          console.log("✅ Données mockées récupérées:", mockUsers);
          setUsers(mockUsers);
          setLastUpdated(new Date());
          
          // N'afficher un toast que si ce n'est pas une erreur de connexion
          if (e instanceof Error && !e.message.includes("fetch")) {
            toast({
              title: "Mode démonstration",
              description: "Utilisation des données de démonstration pour les utilisateurs.",
              duration: 3000,
            });
          }
        } else {
          console.error("❌ Pas de données mockées disponibles");
          throw e;
        }
      }
    } catch (error) {
      console.error("❌ Erreur fatale lors du chargement des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, loadUsers, lastUpdated };
};

export default useUsersDataLoader;
