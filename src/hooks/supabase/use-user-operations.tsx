
import { useState, useCallback } from 'react';
import { User } from '@/types/user';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";

export const useUserOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = null; // We'll replace this with a proper user context when needed

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          supervisor_id: userData.supervisor_id,
          schedule_enabled: userData.schedule_enabled, // Remplacé calendly_enabled par schedule_enabled
          daily_availability: userData.daily_availability,
          weekly_availability: userData.weekly_availability,
        })
        .eq('id', userData.id || '')
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        showErrorToast('La mise à jour du profil a échoué');
        return null;
      }

      showSuccessToast('Profil mis à jour avec succès');
      return data as User;
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour du profil:', error);
      showErrorToast('La mise à jour du profil a échoué');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        showErrorToast('La suppression de l\'utilisateur a échoué');
        return false;
      }

      showSuccessToast('Utilisateur supprimé avec succès');
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
    updateUserProfile,
    deleteUser
  };
};
