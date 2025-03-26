
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Commission } from '@/types/commissions';
import { UserRole } from '@/types';
import { mapCommissionFromDb } from './utils';

/**
 * Récupère les commissions selon le rôle de l'utilisateur
 * - Admin: toutes les commissions
 * - Freelance: uniquement ses commissions
 * - Autres: aucune commission
 */
export async function fetchCommissions(
  supabase: SupabaseClient<Database>,
  userId: string, 
  userRole: UserRole
): Promise<Commission[]> {
  try {
    // Vérifier le rôle de l'utilisateur
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.FREELANCER) {
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
