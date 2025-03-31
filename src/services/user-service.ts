
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
      .select('*')
      .is('deleted_at', null);

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

  // Vérifier si l'ID est un UUID valide
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  
  if (!isValidUUID) {
    console.warn('ID utilisateur non valide pour UUID:', userId);
    
    // Si c'est l'ID de démonstration freelancer-uuid, retourner un utilisateur fictif adapté
    if (userId === 'freelancer-uuid') {
      return {
        id: 'freelancer-uuid',
        name: 'Freelance Demo',
        email: 'freelance@example.com',
        role: 'freelancer' as UserRole
      };
    }
    
    // Retourner un utilisateur simulé dans ce cas
    const mockUsers = getMockUsers();
    return mockUsers.find(u => u.role === 'freelancer') || mockUsers[0];
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

/**
 * Mise à jour du mot de passe d'un utilisateur
 */
export const updateUserPassword = async (userId: string, password: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ password })
      .eq('id', userId);

    if (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de la mise à jour du mot de passe:", error);
    return false;
  }
};

/**
 * Récupère tous les contacts associés à un freelance
 */
export const fetchContactsByFreelancer = async (freelancerId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('freelancer_contacts')
      .select('contact_id')
      .eq('freelancer_id', freelancerId);

    if (error) {
      console.error('Erreur lors de la récupération des contacts du freelance:', error);
      return [];
    }

    return data.map(item => item.contact_id);
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération des contacts du freelance:', error);
    return [];
  }
};

/**
 * Associe un contact à un freelance
 */
export const assignContactToFreelancer = async (freelancerId: string, contactId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('freelancer_contacts')
      .insert({ freelancer_id: freelancerId, contact_id: contactId });

    if (error) {
      console.error("Erreur lors de l'assignation du contact au freelance:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de l'assignation du contact au freelance:", error);
    return false;
  }
};

/**
 * Supprime l'association entre un contact et un freelance
 */
export const removeContactFromFreelancer = async (freelancerId: string, contactId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('freelancer_contacts')
      .delete()
      .eq('freelancer_id', freelancerId)
      .eq('contact_id', contactId);

    if (error) {
      console.error("Erreur lors de la suppression de l'association contact-freelance:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur inattendue lors de la suppression de l'association contact-freelance:", error);
    return false;
  }
};

export { getMockUsers };
