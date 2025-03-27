
import { useState, useCallback } from 'react';
import { User } from '@/types/user';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { getMockUsers as getMockUsersFromUtils } from "@/utils/supabase-mock-data";

export const useUserOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = null; // We'll replace this with a proper user context when needed

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);

  // Méthode pour récupérer la liste des utilisateurs
  const fetchUsers = async (): Promise<User[]> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        showErrorToast('Impossible de récupérer la liste des utilisateurs');
        return [];
      }

      return data as User[];
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des utilisateurs:', error);
      showErrorToast('Impossible de récupérer la liste des utilisateurs');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode pour récupérer un utilisateur par son ID
  const fetchUserById = async (id: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur (${id}):`, error);
        showErrorToast(`Impossible de récupérer l'utilisateur`);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error(`Erreur inattendue lors de la récupération de l'utilisateur (${id}):`, error);
      showErrorToast(`Impossible de récupérer l'utilisateur`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode pour mettre à jour un utilisateur (alias vers updateUserProfile pour compatibilité)
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    const result = await updateUserProfile(userData);
    return result !== null;
  };

  // Méthode pour créer un utilisateur
  const createUser = async (userData: Omit<User, 'id'>): Promise<{ success: boolean; id?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          supervisor_id: userData.supervisor_id,
          schedule_enabled: userData.schedule_enabled,
          daily_availability: userData.daily_availability,
          weekly_availability: userData.weekly_availability,
        })
        .select('id')
        .single();

      if (error) {
        console.error(`Erreur lors de la création de l'utilisateur:`, error);
        showErrorToast(`La création de l'utilisateur a échoué`);
        return { success: false };
      }

      showSuccessToast('Utilisateur créé avec succès');
      return { success: true, id: data.id };
    } catch (error) {
      console.error(`Erreur inattendue lors de la création de l'utilisateur:`, error);
      showErrorToast(`La création de l'utilisateur a échoué`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Méthode pour récupérer des utilisateurs simulés
  const getMockUsers = (): User[] => {
    return getMockUsersFromUtils();
  };

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
    fetchUsers,
    fetchUserById,
    updateUser,
    createUser,
    getMockUsers,
    updateUserProfile,
    deleteUser
  };
};
