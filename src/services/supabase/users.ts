
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { User, UserRole } from '@/types';
import { ServiceResponse } from './types';

export const createUsersService = (supabase: SupabaseClient<Database>) => {
  return {
    /**
     * Récupère tous les utilisateurs
     */
    fetchUsers: async (): Promise<User[]> => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');

        if (error) {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
          throw new Error(`Erreur de récupération: ${error.message}`);
        }

        // Si aucun utilisateur n'est trouvé, retourner un tableau vide
        if (!data || data.length === 0) {
          console.warn('Aucun utilisateur trouvé dans la base de données');
          return [];
        }

        return data.map(user => ({
          ...user,
          role: user.role as UserRole
        })) as User[];
      } catch (error) {
        console.error('Erreur inattendue lors de la récupération des utilisateurs:', error);
        throw error;
      }
    },

    /**
     * Récupère un utilisateur par son ID en gérant les cas où l'ID est numérique
     */
    fetchUserById: async (userId: string): Promise<User | null> => {
      try {
        // Vérifier si l'ID est un UUID valide
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValidUuid = uuidPattern.test(userId);
        
        if (!isValidUuid) {
          console.warn(`ID utilisateur '${userId}' n'est pas un UUID valide. Utilisez un UUID valide.`);
          // Retourner null pour indiquer que cet ID n'est pas valide pour Supabase
          return null;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Cas où l'utilisateur n'est pas trouvé
            console.warn(`Utilisateur avec ID ${userId} non trouvé`);
            return null;
          }
          console.error(`Erreur lors de la récupération de l'utilisateur (${userId}):`, error);
          throw error;
        }

        if (!data) return null;

        return {
          ...data,
          role: data.role as UserRole
        } as User;
      } catch (error) {
        console.error(`Erreur inattendue lors de la récupération de l'utilisateur (${userId}):`, error);
        throw error;
      }
    },

    /**
     * Récupère l'utilisateur actuel (authentifié)
     */
    fetchCurrentUser: async (): Promise<User | null> => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        
        if (!authData.user) {
          return null;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
          throw error;
        }

        if (!data) return null;

        return {
          ...data,
          role: data.role as UserRole
        } as User;
      } catch (error) {
        console.error('Erreur inattendue lors de la récupération de l\'utilisateur actuel:', error);
        throw error;
      }
    },

    /**
     * Met à jour un utilisateur
     */
    updateUser: async (user: Partial<User> & { id: string }): Promise<ServiceResponse<User>> => {
      try {
        // Vérifie l'utilisateur courant
        const { data: authData } = await supabase.auth.getUser();
        
        if (!authData.user) {
          return { 
            success: false, 
            error: "Vous devez être connecté pour effectuer cette action" 
          };
        }
        
        // Vérifier les permissions
        const { data: currentUserData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();
          
        if (userError || !currentUserData) {
          return { 
            success: false, 
            error: "Impossible de vérifier vos permissions" 
          };
        }
        
        // Seul un admin peut modifier un autre utilisateur
        const isAdmin = currentUserData.role === UserRole.ADMIN;
        const isSelfEdit = user.id === authData.user.id;
        
        if (!isAdmin && !isSelfEdit) {
          return { 
            success: false, 
            error: "Vous n'avez pas les droits pour modifier cet utilisateur" 
          };
        }
        
        // Restrictions pour les modifications sensibles
        if (!isAdmin && user.role) {
          // Non-admins ne peuvent pas changer leur propre rôle
          return { 
            success: false, 
            error: "Seul un administrateur peut modifier les rôles" 
          };
        }
        
        // Procéder à la mise à jour
        const { data, error } = await supabase
          .from('users')
          .update(user)
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          console.error(`Erreur lors de la mise à jour de l'utilisateur (${user.id}):`, error);
          return { success: false, error: error.message };
        }

        return { 
          success: true, 
          data: {
            ...data,
            role: data.role as UserRole
          } as User 
        };
      } catch (error: any) {
        console.error(`Erreur inattendue lors de la mise à jour de l'utilisateur (${user.id}):`, error);
        return { success: false, error: error.message || 'Erreur inattendue lors de la mise à jour' };
      }
    },

    /**
     * Crée un nouvel utilisateur - Réservé aux administrateurs
     */
    createUser: async (user: Omit<User, 'id'>, currentUserRole: UserRole): Promise<ServiceResponse<User>> => {
      try {
        // Vérifier si l'utilisateur courant est un administrateur
        if (currentUserRole !== UserRole.ADMIN) {
          return {
            success: false,
            error: "Seuls les administrateurs peuvent créer de nouveaux utilisateurs"
          };
        }
        
        const { data, error } = await supabase
          .from('users')
          .insert(user)
          .select()
          .single();

        if (error) {
          console.error('Erreur lors de la création de l\'utilisateur:', error);
          return { success: false, error: error.message };
        }

        return { 
          success: true, 
          data: {
            ...data,
            role: data.role as UserRole
          } as User 
        };
      } catch (error: any) {
        console.error('Erreur inattendue lors de la création de l\'utilisateur:', error);
        return { success: false, error: error.message || 'Erreur inattendue lors de la création' };
      }
    }
  };
};
