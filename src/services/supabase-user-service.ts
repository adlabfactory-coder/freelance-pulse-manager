
import { supabase } from '@/lib/supabase-client';
import { User, UserRole } from '@/types';
import { getMockUsers } from '@/utils/supabase-mock-data';

/**
 * Récupère tous les utilisateurs
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return getMockUsers(); // Fallback sur les utilisateurs simulés
    }

    if (!data || data.length === 0) {
      console.warn('Aucun utilisateur trouvé dans la base de données');
      return getMockUsers();
    }

    return data.map(user => ({
      ...user,
      role: user.role as UserRole
    })) as User[];
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération des utilisateurs:', error);
    return getMockUsers();
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  if (!userId) {
    console.warn('ID utilisateur non fourni');
    return null;
  }

  try {
    // Vérifier si c'est un utilisateur simulé
    const mockUsers = getMockUsers();
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      return mockUser;
    }

    // Sinon rechercher dans Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur (${userId}):`, error);
      // Retourner un utilisateur simulé en cas d'erreur
      return mockUsers[0];
    }

    if (!data) {
      console.warn(`Utilisateur avec ID ${userId} non trouvé`);
      return mockUsers[0];
    }

    return {
      ...data,
      role: data.role as UserRole
    } as User;
  } catch (error) {
    console.error(`Erreur inattendue lors de la récupération de l'utilisateur (${userId}):`, error);
    return getMockUsers()[0];
  }
};

export { getMockUsers };
