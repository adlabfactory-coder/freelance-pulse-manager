
import { User } from "@/types";
import { UserRole } from "@/types/roles";

/**
 * Génère des utilisateurs fictifs pour le mode démo
 */
export const getMockUsers = (): User[] => {
  return [
    {
      id: "admin-uuid",
      email: "admin@example.com",
      name: "Admin Demo",
      role: UserRole.ADMIN,
      avatar: null
    },
    {
      id: "super-admin-uuid",
      email: "super@example.com",
      name: "Super Admin Demo",
      role: UserRole.SUPER_ADMIN,
      avatar: null
    },
    {
      id: "account-manager-uuid",
      email: "commercial@example.com",
      name: "Commercial Demo",
      role: UserRole.ACCOUNT_MANAGER,
      avatar: null
    },
    {
      id: "freelancer-uuid",
      email: "freelance@example.com",
      name: "Freelance Demo",
      role: UserRole.FREELANCER,
      avatar: null
    }
  ];
};

/**
 * Vérifie la synchronisation entre les utilisateurs démo et Supabase
 */
export const checkUserSyncStatus = async (supabaseClient: any): Promise<{
  syncedUsers: number,
  totalUsers: number,
  users: Array<{email: string, synced: boolean}>
}> => {
  const mockUsers = getMockUsers();
  const results = {
    syncedUsers: 0,
    totalUsers: mockUsers.length,
    users: [] as Array<{email: string, synced: boolean}>
  };

  try {
    for (const user of mockUsers) {
      const { data, error } = await supabaseClient
        .from('auth.users')
        .select('email')
        .eq('email', user.email)
        .single();
      
      const synced = !error && data;
      results.users.push({
        email: user.email,
        synced
      });
      
      if (synced) {
        results.syncedUsers++;
      }
    }
  } catch (err) {
    console.error("Erreur lors de la vérification de la synchronisation:", err);
  }
  
  return results;
};
