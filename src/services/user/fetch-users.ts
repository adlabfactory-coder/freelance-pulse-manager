
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getMockUsers } from '@/utils/supabase-mock-data';

/**
 * Récupère tous les utilisateurs avec uniquement admin et super admin pour la production
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
