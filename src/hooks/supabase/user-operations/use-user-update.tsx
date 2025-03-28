
import { useState, useCallback } from 'react';
import { User } from '@/types';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);
  
  // Méthode pour mettre à jour un utilisateur (alias vers updateUserProfile pour compatibilité)
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    const result = await updateUserProfile(userData);
    return result !== null;
  };
  
  const updateUserProfile = async (userData: Partial<User> & { password?: string }): Promise<User | null> => {
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
          schedule_enabled: userData.schedule_enabled,
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

  return {
    isLoading,
    updateUser,
    updateUserProfile
  };
};
