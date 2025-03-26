
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { getMockUsers, getMockUserById } from '@/utils/supabase-mock-data';

/**
 * Récupère un utilisateur par son ID
 */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    // Amélioration de la gestion des utilisateurs de démonstration
    if (userId === "1" || userId === "2" || userId === "3" || 
        userId === "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc" || 
        userId === "487fb1af-4396-49d1-ba36-8711facbb03c" || 
        userId === "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda") {
      
      // Vérifier d'abord les ID UUID de démonstration
      if (userId === "7cbd0c03-de0b-435f-a84d-b14e0dfdc4dc") {
        return getMockUsers()[0]; // Admin démo
      } else if (userId === "487fb1af-4396-49d1-ba36-8711facbb03c") {
        return getMockUsers()[1]; // Commercial démo
      } else if (userId === "2b6329d2-73e4-4f5e-b56e-c26cdf4b3dda") {
        return getMockUsers()[2]; // Client démo
      } else {
        // Fallback pour les anciens ID numériques
        return getMockUserById(userId);
      }
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
        // Essayons de récupérer un utilisateur démo avec cet ID
        return getMockUserById(userId) || getMockUsers()[0]; // Fallback sur admin démo
      }
      
      if (!data) {
        console.warn("Aucun utilisateur trouvé avec l'ID:", userId);
        return getMockUsers()[0]; // Fallback sur admin démo
      }
      
      return {
        ...data,
        role: data.role as UserRole
      } as User;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Ne pas lancer d'erreur ici, retourner un utilisateur démo
      return getMockUserById(userId) || getMockUsers()[0];
    }
  } catch (error) {
    console.error('Erreur fatale lors de la récupération de l\'utilisateur:', error);
    return getMockUsers()[0]; // Fallback en cas d'erreur fatale
  }
};
