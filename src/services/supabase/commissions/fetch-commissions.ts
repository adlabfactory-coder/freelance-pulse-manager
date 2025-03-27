
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Commission } from '@/types/commissions';
import { UserRole, hasMinimumRole } from '@/types/roles';
import { mapCommissionFromDb } from './utils';

/**
 * Récupère les commissions selon le rôle de l'utilisateur
 * - Admin/SuperAdmin: toutes les commissions
 * - Freelance: uniquement ses commissions
 * - Autres: aucune commission
 */
export async function fetchCommissions(
  supabase: SupabaseClient<Database>,
  userId: string, 
  userRole: UserRole
): Promise<Commission[]> {
  try {
    // Vérifier que le rôle a au moins les permissions de freelance
    const hasAccess = hasMinimumRole(userRole, UserRole.FREELANCER);
    const isAdminOrHigher = hasMinimumRole(userRole, UserRole.ADMIN);
    
    if (!hasAccess) {
      console.log("Accès refusé: rôle non autorisé à voir les commissions");
      return [];
    }

    let query = supabase
      .from("commissions")
      .select(`
        *,
        freelancer:users(name)
      `);
    
    // Si c'est un freelancer, filtrer uniquement ses commissions
    // Les admins et super admins voient toutes les commissions
    if (userRole === UserRole.FREELANCER) {
      query = query.eq("freelancerId", userId);
    }
    
    const { data, error } = await query.order("createdAt", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(mapCommissionFromDb);
  } catch (error) {
    console.error("Erreur lors du chargement des commissions:", error);
    throw error;
  }
}
