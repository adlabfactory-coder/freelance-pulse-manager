
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { UserRole, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileTabs from "./UserProfileTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getMockUsers } from "@/utils/supabase-mock-data";

interface UserProfileProps {
  userId: string;
  currentUser: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, currentUser }) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-4 mt-6">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-destructive text-lg font-medium">
          {error || "Utilisateur non trouvé"}
        </div>
        <p className="text-muted-foreground">
          Veuillez rafraîchir la page ou sélectionner un autre utilisateur.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileHeader isCurrentUser={isCurrentUser} userName={user.name} />
      <UserProfileTabs
        user={user}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        role={role}
        setRole={setRole}
        isCurrentUser={isCurrentUser}
        canEdit={canEdit}
        currentUserRole={currentUser.role}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default UserProfile;
