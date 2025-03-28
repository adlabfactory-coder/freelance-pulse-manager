
import { useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { getMockUsers as getMockUsersFromUtils } from "@/utils/supabase-mock-data";

export const useFetchUsers = () => {
  const [isLoading, setIsLoading] = useState(false);

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

      return data.map(user => ({
        ...user,
        role: user.role as UserRole
      })) as User[];
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

  // Méthode pour récupérer des utilisateurs simulés
  const getMockUsers = (): User[] => {
    return getMockUsersFromUtils();
  };

  return {
    isLoading,
    fetchUsers,
    fetchUserById,
    getMockUsers
  };
};
