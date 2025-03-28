
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
      
      // Utiliser la suppression douce au lieu de la suppression définitive
      const { error } = await supabase
        .from('users')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        showErrorToast('La suppression de l\'utilisateur a échoué');
        return { success: false, error: error.message };
      }

      showSuccessToast('Utilisateur supprimé avec succès (sera définitivement supprimé après 48 heures)');
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
