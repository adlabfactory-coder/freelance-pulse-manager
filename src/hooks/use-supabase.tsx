import { createSupabaseService } from '@/services/supabase';
import { User, UserRole } from '@/types';
import { auditCreate, auditDelete, auditUpdate } from '@/services/audit-service';
import { validateSupabaseConfig } from '@/lib/supabase-client';
import { fetchUsers, fetchUserById, updateUser, createUser, deleteUser } from '@/services/user';

// Hook centralisé pour accéder aux services Supabase
export const useSupabase = () => {
  // Validation de la configuration Supabase au démarrage
  const isConfigValid = validateSupabaseConfig();
  if (!isConfigValid) {
    console.warn("La configuration Supabase n'est pas valide. Certaines fonctionnalités peuvent ne pas fonctionner correctement.");
  }
  
  // Créer un service Supabase centralisé
  const supabaseService = createSupabaseService();
  
  return {
    // Client Supabase
    supabaseClient: supabaseService.client,
    
    // Fonctions de vérification de la connexion
    checkSupabaseStatus: supabaseService.checkConnection,
    
    // Fonctions de gestion de la base de données
    checkDatabaseStatus: supabaseService.database.checkStatus,
    initializeDatabase: supabaseService.database.initialize,
    
    // Services des utilisateurs - Utiliser les fonctions importées de notre nouveau module
    fetchUsers,
    fetchUserById,
    
    // Mise à jour d'un utilisateur avec audit
    updateUser: async (userData: Partial<User> & { id: string }) => {
      const success = await updateUser(userData.id, userData);
      if (success) {
        // Log de l'action dans l'audit
        auditUpdate('system', UserRole.ADMIN, 'users', userData.id, {
          fields: Object.keys(userData).filter(k => k !== 'id')
        });
      }
      return { success };
    },
    
    // Création d'un utilisateur avec audit
    createUser: async (userData: Omit<User, 'id'>) => {
      const result = await createUser(userData, UserRole.ADMIN);
      if (result.success && result.userId) {
        // Log de l'action dans l'audit
        auditCreate('system', UserRole.ADMIN, 'users', result.userId, {
          role: userData.role
        });
      }
      return result;
    },
    
    // Suppression d'un utilisateur avec audit
    deleteUser: async (userId: string) => {
      const result = await deleteUser(userId, UserRole.ADMIN);
      if (result.success) {
        // Log de l'action dans l'audit
        auditDelete('system', UserRole.ADMIN, 'users', userId, {});
      }
      return result;
    },
    
    // Fonctions de conversion de données - Avec UserRole explicite
    getMockUsers: (): User[] => {
      return [
        {
          id: '7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc',
          name: 'Super Admin Démo',
          email: 'superadmin@example.com',
          role: UserRole.SUPER_ADMIN,
          avatar: null
        },
        {
          id: '6a94bd3d-7f5c-49ae-b09e-e570cb01a978',
          name: 'Admin Démo',
          email: 'admin@example.com',
          role: UserRole.ADMIN,
          avatar: null
        },
        {
          id: '487fb1af-4396-49d1-ba36-8711facbb03c',
          name: 'Freelancer Démo',
          email: 'freelancer@example.com',
          role: UserRole.FREELANCER,
          avatar: null
        },
        {
          id: '3f8e3f1c-c6f9-4c04-a0b9-88d7f6d8e05c',
          name: 'Chargé de Compte Démo',
          email: 'account@example.com',
          role: UserRole.ACCOUNT_MANAGER,
          avatar: null
        }
      ];
    }
  };
};
