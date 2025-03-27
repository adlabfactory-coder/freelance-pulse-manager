
import { useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { fetchUserById, updateUser } from "@/services/user";

export const useUserProfileData = (userId?: string) => {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.FREELANCER);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Si aucun ID n'est fourni, utiliser l'utilisateur actuel
  const targetUserId = userId || currentUser?.id;

  // Récupérer les données utilisateur
  useEffect(() => {
    const loadUser = async () => {
      if (authLoading) return;
      
      if (!targetUserId) {
        setLoading(false);
        setError("Aucun utilisateur spécifié");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Si c'est l'utilisateur actuel, utiliser les données de l'auth context
        if (targetUserId === currentUser?.id) {
          setUser(currentUser);
          setName(currentUser.name);
          setEmail(currentUser.email);
          setRole(currentUser.role as UserRole);
        } else {
          // Sinon, récupérer les données depuis l'API
          const userData = await fetchUserById(targetUserId);
          if (userData) {
            setUser(userData);
            setName(userData.name);
            setEmail(userData.email);
            setRole(userData.role as UserRole);
          } else {
            setError("Utilisateur non trouvé");
          }
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des données utilisateur");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données utilisateur",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [targetUserId, currentUser, authLoading, toast]);

  // Fonction pour sauvegarder les modifications
  const saveChanges = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const success = await updateUser(user.id, {
        name,
        email,
        role,
      });
      
      if (success) {
        setUser({
          ...user,
          name,
          email,
          role,
        });
        setIsEditing(false);
        toast({
          title: "Profil mis à jour",
          description: "Les informations ont été enregistrées avec succès.",
        });
        return true;
      } else {
        throw new Error("Échec de la mise à jour du profil");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de la sauvegarde",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    loading,
    error,
    name,
    setName,
    email,
    setEmail,
    role,
    setRole: (newRole: UserRole) => setRole(newRole),
    isEditing,
    setIsEditing,
    isSaving,
    saveChanges,
    isCurrentUser: targetUserId === currentUser?.id,
  };
};
