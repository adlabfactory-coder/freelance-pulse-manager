
import { useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);
  
  // Méthode pour créer un utilisateur
  const createUser = async (userData: Omit<User, 'id'> & { password?: string }): Promise<{ success: boolean; id?: string }> => {
    try {
      setIsLoading(true);
      
      // Si un mot de passe est fourni, créer un compte d'authentification
      if (userData.password) {
        // Créer un utilisateur dans l'authentification Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              role: userData.role
            }
          }
        });
        
        if (authError) {
          console.error(`Erreur lors de la création du compte d'authentification:`, authError);
          showErrorToast(`La création de l'utilisateur a échoué: ${authError.message}`);
          return { success: false };
        }
        
        if (!authData.user) {
          console.error(`Aucun utilisateur créé dans l'authentification`);
          showErrorToast(`La création de l'utilisateur a échoué`);
          return { success: false };
        }
        
        // Le trigger on_auth_user_created devrait automatiquement créer l'entrée dans la table users
        showSuccessToast('Utilisateur créé avec succès');
        return { success: true, id: authData.user.id };
      }
      
      // Sinon, créer simplement une entrée dans la table users
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

  return {
    isLoading,
    createUser
  };
};
