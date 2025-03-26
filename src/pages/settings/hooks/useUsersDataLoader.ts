
import { useState, useCallback } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

export const useUsersDataLoader = () => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadUsers = useCallback(async (useMockData = false) => {
    try {
      if (useMockData) {
        console.log("Utilisation des données de démonstration");
        const mockUsers = supabase.getMockUsers();
        // Convertir explicitement les rôles string en UserRole
        const typedMockUsers = mockUsers.map(user => ({
          ...user,
          role: user.role as UserRole
        }));
        setUsers(typedMockUsers);
        
        // Utiliser le premier utilisateur comme utilisateur actuel
        if (typedMockUsers.length > 0) {
          const user = typedMockUsers[0];
          setCurrentUser(user);
          return { users: typedMockUsers, currentUser: user };
        }
        
        toast({
          variant: "default",
          title: "Mode démo activé",
          description: "Utilisation des données de démonstration car Supabase n'est pas accessible.",
        });
        
        return { users: typedMockUsers, currentUser: typedMockUsers[0] || null };
      } else {
        // Essayer de récupérer les données depuis Supabase
        try {
          console.log("Récupération des utilisateurs...");
          const usersData = await supabase.fetchUsers();
          console.log("Utilisateurs récupérés:", usersData);
          
          if (usersData.length > 0) {
            const user = usersData[0];
            setCurrentUser(user);
            setUsers(usersData);
            return { users: usersData, currentUser: user };
          } else {
            throw new Error("Aucun utilisateur trouvé dans Supabase");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      throw error;
    }
  }, [supabase]);
  
  return {
    users,
    currentUser,
    isLoading,
    setUsers,
    setCurrentUser,
    setIsLoading,
    loadUsers
  };
};
