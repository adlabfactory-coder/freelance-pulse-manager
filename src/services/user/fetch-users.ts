
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getMockUsers } from '@/utils/supabase-mock-data';

/**
 * Récupère tous les utilisateurs
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    console.log("🔄 Tentative de récupération des utilisateurs");
    
    // En mode production, ne retourner que les administrateurs
    const mockUsers = getMockUsers().filter(user => 
      user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
    );
    
    console.log(`✅ Récupération réussie: ${mockUsers.length} utilisateurs (administrateurs uniquement)`);
    return mockUsers;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    // Retourner un tableau avec uniquement les admins en cas d'erreur
    return getMockUsers().filter(user => 
      user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
    );
  }
};

/**
 * Récupère tous les freelancers
 */
export const fetchFreelancers = async (): Promise<User[]> => {
  try {
    console.log("🔄 Tentative de récupération des freelancers");
    
    // En mode démonstration, retourner tous les utilisateurs avec le rôle FREELANCER
    const mockUsers = getMockUsers().filter(user => 
      user.role === UserRole.FREELANCER
    );
    
    console.log(`✅ Récupération réussie: ${mockUsers.length} freelancers`);
    return mockUsers;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des freelancers:', error);
    // Retourner un tableau avec uniquement les freelancers en cas d'erreur
    return getMockUsers().filter(user => 
      user.role === UserRole.FREELANCER
    );
  }
};

/**
 * Récupère tous les chargés de compte
 */
export const fetchAccountManagers = async (): Promise<User[]> => {
  try {
    console.log("🔄 Tentative de récupération des chargés de compte");
    
    // En mode démonstration, retourner tous les utilisateurs avec le rôle ACCOUNT_MANAGER
    const mockUsers = getMockUsers().filter(user => 
      user.role === UserRole.ACCOUNT_MANAGER
    );
    
    console.log(`✅ Récupération réussie: ${mockUsers.length} chargés de compte`);
    return mockUsers;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des chargés de compte:', error);
    // Retourner un tableau avec uniquement les chargés de compte en cas d'erreur
    return getMockUsers().filter(user => 
      user.role === UserRole.ACCOUNT_MANAGER
    );
  }
};
