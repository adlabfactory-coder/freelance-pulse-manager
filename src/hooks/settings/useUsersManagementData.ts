
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getMockUsers } from "@/utils/supabase-mock-data";

export const useUsersManagementData = (externalUsers?: User[], externalLoading?: boolean) => {
  const { fetchUsers } = useSupabase();
  const [users, setUsers] = useState<User[]>(externalUsers || []);
  const [isLoading, setIsLoading] = useState(externalLoading !== undefined ? externalLoading : true);
  const [hasError, setHasError] = useState(false);

  const fetchUsersData = async () => {
    if (externalUsers && externalUsers.length > 0) {
      setUsers(externalUsers);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    try {
      const fetchedUsers = await fetchUsers();
      console.info("Utilisateurs récupérés:", fetchedUsers);
      
      if (fetchedUsers && fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
      } else {
        const demoUsers = getMockUsers();
        setUsers(demoUsers);
        toast({
          variant: "default",
          title: "Mode démo activé",
          description: "Utilisation des données de démonstration car aucun utilisateur n'a été trouvé.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      const demoUsers = getMockUsers();
      setUsers(demoUsers);
      setHasError(true);
      toast({
        variant: "default",
        title: "Mode démo activé",
        description: "Utilisation des données de démonstration pour les utilisateurs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!externalUsers) {
      fetchUsersData();
    }
  }, [externalUsers]);

  useEffect(() => {
    if (externalUsers) {
      setUsers(externalUsers);
    }
    if (externalLoading !== undefined) {
      setIsLoading(externalLoading);
    }
  }, [externalUsers, externalLoading]);

  return {
    users,
    isLoading,
    hasError,
    fetchUsersData
  };
};

export default useUsersManagementData;
