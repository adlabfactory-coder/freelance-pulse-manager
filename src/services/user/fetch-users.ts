
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { getMockUsers } from '@/utils/supabase-mock-data';

/**
 * Récupère tous les utilisateurs
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    console.log("🔄 Tentative de récupération des utilisateurs");
    
    // Récupérer tous les utilisateurs actifs
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .is('deleted_at', null);
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      // Fallback à la version mock en cas d'erreur
      return getMockUsers().filter(user => 
        user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
      );
    }
    
    if (users && users.length > 0) {
      const adminUsers = users.filter(user => 
        user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
      );
      console.log(`✅ Récupération réussie: ${adminUsers.length} administrateurs`);
      return adminUsers;
    }
    
    // En mode production, ne retourner que les administrateurs
    const mockUsers = getMockUsers().filter(user => 
      user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
    );
    
    console.log(`✅ Récupération réussie: ${mockUsers.length} utilisateurs (administrateurs uniquement - mode mock)`);
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
    
    // Récupérer tous les utilisateurs actifs avec le rôle FREELANCER
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', UserRole.FREELANCER)
      .is('deleted_at', null);
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des freelancers:', error);
      return getMockUsers().filter(user => user.role === UserRole.FREELANCER);
    }
    
    if (users && users.length > 0) {
      console.log(`✅ Récupération réussie: ${users.length} freelancers`);
      return users as User[];
    }
    
    // Mode démo
    const mockUsers = getMockUsers().filter(user => user.role === UserRole.FREELANCER);
    console.log(`✅ Récupération réussie: ${mockUsers.length} freelancers (mode mock)`);
    return mockUsers;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des freelancers:', error);
    // Retourner un tableau avec uniquement les freelancers en cas d'erreur
    return getMockUsers().filter(user => user.role === UserRole.FREELANCER);
  }
};

/**
 * Récupère tous les chargés de compte
 */
export const fetchAccountManagers = async (): Promise<User[]> => {
  try {
    console.log("🔄 Tentative de récupération des chargés de compte");
    
    // Récupérer tous les utilisateurs actifs avec le rôle ACCOUNT_MANAGER
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', UserRole.ACCOUNT_MANAGER)
      .is('deleted_at', null);
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des chargés de compte:', error);
      return getMockUsers().filter(user => user.role === UserRole.ACCOUNT_MANAGER);
    }
    
    if (users && users.length > 0) {
      console.log(`✅ Récupération réussie: ${users.length} chargés de compte réels`);
      return users as User[];
    }
    
    // Mode démo
    const mockUsers = getMockUsers().filter(user => user.role === UserRole.ACCOUNT_MANAGER);
    console.log(`✅ Récupération réussie: ${mockUsers.length} chargés de compte (mode mock)`);
    return mockUsers;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des chargés de compte:', error);
    // Retourner un tableau avec uniquement les chargés de compte en cas d'erreur
    return getMockUsers().filter(user => user.role === UserRole.ACCOUNT_MANAGER);
  }
};
