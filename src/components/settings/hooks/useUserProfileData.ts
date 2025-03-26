
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { UserRole, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getMockUsers } from "@/utils/supabase-mock-data";

export const useUserProfileData = (userId: string, currentUser: User) => {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.FREELANCER);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isCurrentUser = userId === currentUser.id;
  const canEdit = isCurrentUser || currentUser.role === UserRole.ADMIN;

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching user with ID:", userId);
        let userData: User | null = null;
        
        // Tentative de récupération depuis Supabase
        try {
          userData = await supabase.fetchUserById(userId);
        } catch (e) {
          console.error("Erreur de récupération depuis Supabase:", e);
          // Si on a une fonction de mock, on l'utilise en fallback
          const mockUsers = getMockUsers();
          userData = mockUsers.find(u => u.id === userId) || null;
          if (userData) {
            // Convertir explicitement le rôle en UserRole
            userData = {
              ...userData,
              role: userData.role as UserRole
            };
            console.log("Utilisateur trouvé dans les données de démonstration:", userData);
          }
        }
        
        if (isMounted) {
          if (userData) {
            console.log("User data retrieved:", userData);
            setUser(userData);
            setName(userData.name);
            setEmail(userData.email);
            setRole(userData.role);
          } else {
            console.error("Utilisateur non trouvé après tentative de récupération");
            setError("Impossible de récupérer les informations de l'utilisateur");
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de récupérer les informations de l'utilisateur.",
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        if (isMounted) {
          setError("Une erreur est survenue lors du chargement des données");
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les informations de l'utilisateur.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    
    // Cleanup pour éviter les fuites de mémoire
    return () => {
      isMounted = false;
    };
  }, [userId, supabase]);

  const handleSubmit = async () => {
    if (!canEdit) return;
    
    setIsSubmitting(true);
    try {
      // Préparation des données à mettre à jour
      const updatedUser = {
        id: userId,
        name,
        email,
        role
      };
      
      // Vérifier si l'utilisateur est administrateur
      const isAdmin = currentUser.role === UserRole.ADMIN;
      
      // Seuls les administrateurs peuvent effectuer certaines modifications
      if (!isAdmin && currentUser.id !== userId) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits pour modifier cet utilisateur.",
        });
        return;
      }
      
      try {
        // Tenter la mise à jour via Supabase
        const { success } = await supabase.updateUser(updatedUser);

        if (success) {
          toast({
            title: "Profil mis à jour",
            description: "Les informations du profil ont été enregistrées avec succès.",
          });
          
          // Update local user data
          if (user) {
            setUser({
              ...user,
              name,
              email,
              role
            });
          }
        } else {
          throw new Error("Échec de la mise à jour du profil");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement du profil.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du profil.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    name,
    setName,
    email,
    setEmail,
    role,
    setRole,
    isLoading,
    isSubmitting,
    error,
    isCurrentUser,
    canEdit,
    handleSubmit
  };
};
