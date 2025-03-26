
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { getMockUsers, getMockUserById } from '@/utils/supabase-mock-data';

/**
 * Récupère un utilisateur par son ID
 */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    // Utilisateurs de démonstration avec IDs UUID
    const mockUsers = getMockUsers();
    
    // Vérifier directement si l'ID correspond à un utilisateur de démonstration
    const demoUser = mockUsers.find(user => user.id === userId);
    if (demoUser) {
      console.log("Utilisateur de démonstration trouvé avec ID", userId);
      return demoUser;
    }
    
    // Pour les vrais utilisateurs dans Supabase
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn("Erreur lors de la récupération de l'utilisateur:", error.message);
        // Fallback sur admin démo
        return mockUsers[0];
      }
      
      if (!data) {
        console.warn("Aucun utilisateur trouvé avec l'ID:", userId);
        return mockUsers[0]; // Fallback sur admin démo
      }
      
      return {
        ...data,
        role: data.role as UserRole
      } as User;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Fallback sur admin démo
      return mockUsers[0];
    }
  } catch (error) {
    console.error('Erreur fatale lors de la récupération de l\'utilisateur:', error);
    return getMockUsers()[0]; // Fallback en cas d'erreur fatale
  }
};
