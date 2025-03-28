
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { OperationResult } from '../supabase-provider';

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);
  
  // Méthode mise à jour pour supprimer un utilisateur en utilisant la suppression douce
  const deleteUser = async (userId: string): Promise<OperationResult> => {
    try {
      setIsLoading(true);
      
      // Utiliser la fonction SQL de suppression douce (avec le rôle de l'utilisateur courant)
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        showErrorToast('La suppression de l\'utilisateur a échoué');
        return { success: false, error: error.message };
      }

      showSuccessToast('Utilisateur supprimé avec succès');
      return { success: true };
    } catch (error: any) {
      console.error('Erreur inattendue lors de la suppression de l\'utilisateur:', error);
      showErrorToast('La suppression de l\'utilisateur a échoué');
      return { success: false, error: error.message || 'Erreur inattendue' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteUser
  };
};
