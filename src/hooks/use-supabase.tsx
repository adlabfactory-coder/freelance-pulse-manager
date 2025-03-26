
import { createSupabaseService } from '@/services/supabase';
import { User, UserRole } from '@/types';
import { auditCreate, auditDelete, auditUpdate } from '@/services/audit-service';
import { validateSupabaseConnection } from '@/integrations/supabase/client';

// Hook centralisé pour accéder aux services Supabase
export const useSupabase = () => {
  // Validation de la configuration Supabase au démarrage
  const isConfigValid = validateSupabaseConnection();
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
    
    // Services des utilisateurs avec audit
    fetchUsers: supabaseService.users.fetchUsers,
    fetchUserById: supabaseService.users.fetchUserById,
    
    // Mise à jour d'un utilisateur avec audit
    updateUser: async (userData: Partial<User> & { id: string }) => {
      const result = await supabaseService.users.updateUser(userData);
      if (result.success && result.data) {
        // Log de l'action dans l'audit
        auditUpdate('system', UserRole.ADMIN, 'users', userData.id, {
          fields: Object.keys(userData).filter(k => k !== 'id')
        });
      }
      return result;
    },
    
    // Création d'un utilisateur avec audit
    createUser: async (userData: Omit<User, 'id'>) => {
      const result = await supabaseService.users.createUser(userData, UserRole.ADMIN);
      if (result.success && result.data) {
        // Log de l'action dans l'audit
        auditCreate('system', UserRole.ADMIN, 'users', result.data.id, {
          role: userData.role
        });
      }
      return result;
    },
    
    // Suppression d'un utilisateur avec audit
    deleteUser: async (userId: string) => {
      // Implémentation fictive pour la démo
      const success = true;
      if (success) {
        // Log de l'action dans l'audit
        auditDelete('system', UserRole.ADMIN, 'users', userId, {});
      }
      return { success };
    },
    
    // Fonctions de conversion de données - Avec UserRole explicite
    getMockUsers: (): User[] => {
      return [
        {
          id: '1',
          name: 'Super Admin Démo',
          email: 'superadmin@example.com',
          role: UserRole.SUPER_ADMIN,
          avatar: null,
          calendly_enabled: true,
          calendly_url: 'https://calendly.com/superadmin-demo',
          calendly_sync_email: 'superadmin@example.com'
        },
        {
          id: '4',
          name: 'Admin Démo',
          email: 'admin@example.com',
          role: UserRole.ADMIN,
          avatar: null,
          calendly_enabled: true,
          calendly_url: 'https://calendly.com/admin-demo',
          calendly_sync_email: 'admin@example.com'
        },
        {
          id: '2',
          name: 'Commercial Démo',
          email: 'commercial@example.com',
          role: UserRole.FREELANCER,
          avatar: null,
          calendly_enabled: true,
          calendly_url: 'https://calendly.com/commercial-demo',
          calendly_sync_email: 'commercial@example.com'
        },
        {
          id: '5',
          name: 'Chargé de Compte Démo',
          email: 'account@example.com',
          role: UserRole.ACCOUNT_MANAGER,
          avatar: null,
          calendly_enabled: true,
          calendly_url: 'https://calendly.com/account-demo',
          calendly_sync_email: 'account@example.com'
        },
        {
          id: '3',
          name: 'Client Démo',
          email: 'client@example.com',
          role: UserRole.CLIENT,
          avatar: null,
          calendly_enabled: false,
          calendly_url: '',
          calendly_sync_email: ''
        }
      ];
    }
  };
};
