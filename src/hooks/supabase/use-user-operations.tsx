import { useState, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from './supabase-provider';

export const useUserOperations = () => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const { user, setUser } = useUser();

  const showSuccessToast = useCallback((message: string) => {
    toast({
      title: 'Succès',
      description: message,
    });
  }, [toast]);

  const showErrorToast = useCallback((message: string) => {
    toast({
      title: 'Erreur',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
    try {
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
        .eq('id', user?.id || '')
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        showErrorToast('La mise à jour du profil a échoué');
        return null;
      }

      // Mise à jour du contexte utilisateur
      setUser({
        ...user!,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
        supervisor_id: data.supervisor_id,
        schedule_enabled: data.schedule_enabled,
        daily_availability: data.daily_availability,
        weekly_availability: data.weekly_availability,
      });

      showSuccessToast('Profil mis à jour avec succès');
      return data as User;
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour du profil:', error);
      showErrorToast('La mise à jour du profil a échoué');
      return null;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
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
    }
  };

  return {
    updateUserProfile,
    deleteUser,
  };
};
