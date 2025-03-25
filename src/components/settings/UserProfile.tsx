
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { UserRole, User } from "@/types";
import { toast } from "@/components/ui/use-toast";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileTabs from "./UserProfileTabs";

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
  
  const isCurrentUser = userId === currentUser.id;
  const canEdit = isCurrentUser || currentUser.role === UserRole.ADMIN;

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await supabase.fetchUserById(userId);
        if (userData) {
          setUser(userData);
          setName(userData.name);
          setEmail(userData.email);
          setRole(userData.role);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les informations de l'utilisateur.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, supabase]);

  const handleSubmit = async () => {
    if (!canEdit) return;
    
    setIsSubmitting(true);
    try {
      const success = await supabase.updateUser(userId, {
        name,
        email,
        role
      });

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
    return <div className="text-center py-8">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">Utilisateur non trouvé</div>;
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
