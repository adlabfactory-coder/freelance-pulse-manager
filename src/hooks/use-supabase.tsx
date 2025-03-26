
import { createSupabaseService } from '@/services/supabase';

// Hook centralisé pour accéder aux services Supabase
export const useSupabase = () => {
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
    
    // Services des utilisateurs
    fetchUsers: supabaseService.users.fetchUsers,
    fetchUserById: supabaseService.users.fetchUserById,
    updateUser: supabaseService.users.updateUser,
    
    // Fonctions de conversion de données
    getMockUsers: () => {
      // Conserver la fonction pour la retrocompatibilité
      return [
        {
          id: '1',
          name: 'Admin Démo',
          email: 'admin@example.com',
          role: 'admin',
          avatar: null,
          calendly_enabled: true,
          calendly_url: 'https://calendly.com/admin-demo',
          calendly_sync_email: 'admin@example.com'
        },
        {
          id: '2',
          name: 'Commercial Démo',
          email: 'commercial@example.com',
          role: 'freelancer',
          avatar: null,
          calendly_enabled: true,
          calendly_url: 'https://calendly.com/commercial-demo',
          calendly_sync_email: 'commercial@example.com'
        },
        {
          id: '3',
          name: 'Client Démo',
          email: 'client@example.com',
          role: 'client',
          avatar: null,
          calendly_enabled: false,
          calendly_url: '',
          calendly_sync_email: ''
        }
      ];
    }
  };
};
