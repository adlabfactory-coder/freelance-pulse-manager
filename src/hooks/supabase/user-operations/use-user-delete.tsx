
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);
  
  // Méthode mise à jour pour supprimer un utilisateur en utilisant la suppression douce
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Utiliser la nouvelle fonction SQL de suppression douce (avec le rôle de l'utilisateur courant)
      const { data, error } = await supabase
        .rpc('soft_delete_user', { 
          user_id: userId, 
          current_user_role: 'admin' // Normalement, cela devrait venir du contexte d'authentification
        });

      if (error) {
        console.error('Erreur lors de la suppression douce de l\'utilisateur:', error);
        showErrorToast('La suppression de l\'utilisateur a échoué');
        return false;
      }

      if (!data.success) {
        console.error('Échec de la suppression douce:', data.error);
        showErrorToast(data.error || 'La suppression de l\'utilisateur a échoué');
        return false;
      }

      showSuccessToast('Utilisateur supprimé avec succès (sera définitivement supprimé dans 48 heures)');
      return true;
    } catch (error) {
      console.error('Erreur inattendue lors de la suppression de l\'utilisateur:', error);
      showErrorToast('La suppression de l\'utilisateur a échoué');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteUser
  };
};
