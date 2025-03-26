
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { CommissionRule } from '@/types/commissions';
import { getDefaultCommissionRules, mapCommissionRuleFromDb } from './utils';

/**
 * Récupère les règles de commission
 */
export async function fetchCommissionRules(
  supabase: SupabaseClient<Database>
): Promise<CommissionRule[]> {
  try {
    const { data, error } = await supabase
      .from("commission_rules")
      .select("*")
      .order("minContracts", { ascending: true });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn("Aucune règle de commission trouvée, utilisation des valeurs par défaut");
      return getDefaultCommissionRules();
    }
    
    return data.map(mapCommissionRuleFromDb);
  } catch (error) {
    console.error("Erreur lors du chargement des règles de commissions:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return getDefaultCommissionRules();
  }
}
