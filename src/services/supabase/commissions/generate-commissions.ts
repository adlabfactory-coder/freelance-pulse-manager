
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { CommissionTier, CommissionStatus } from '@/types/commissions';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { determineCommissionTier, calculateCommissionAmount } from '@/utils/commission';
import { mapTierToDb } from './utils';

/**
 * Génère automatiquement les commissions pour un mois donné
 * Fonction réservée aux administrateurs
 */
export async function generateMonthlyCommissions(
  supabase: SupabaseClient<Database>, 
  month: Date, 
  userRole: UserRole
): Promise<boolean> {
  try {
    // Vérifier si l'utilisateur est administrateur
    if (userRole !== UserRole.ADMIN) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un administrateur peut générer les commissions mensuelles",
      });
      return false;
    }
    
    // 1. Récupérer les règles de commission
    const { data: rules, error: rulesError } = await supabase
      .from("commission_rules")
      .select("*")
      .order("minContracts", { ascending: true });
    
    if (rulesError) {
      throw new Error("Impossible de récupérer les règles de commission");
    }
    
    // 2. Obtenir tous les freelancers
    const { data: freelancers, error: freelancersError } = await supabase
      .from("users")
      .select("id, name")
      .eq("role", UserRole.FREELANCER);
    
    if (freelancersError) {
      throw new Error("Impossible de récupérer la liste des freelancers");
    }
    
    // 3. Pour chaque freelancer, calculer les commissions du mois
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    let successCount = 0;
    
    for (const freelancer of freelancers) {
      try {
        // 3.1 Compter le nombre de devis approuvés pendant le mois
        const { count, error: quotesError } = await supabase
          .from("quotes")
          .select("*", { count: 'exact', head: true })
          .eq("freelancerId", freelancer.id)
          .eq("status", "approved")
          .gte("createdAt", startDate.toISOString())
          .lte("createdAt", endDate.toISOString());
        
        if (quotesError) {
          console.error(`Erreur lors du comptage des contrats pour ${freelancer.name}:`, quotesError);
          continue;
        }
        
        const contractsCount = count || 0;
        
        // Si aucun contrat, ne pas créer de commission
        if (contractsCount === 0) continue;
        
        // 3.2 Déterminer le palier applicable
        const tier = determineCommissionTier(contractsCount, rules);
        const tierString = mapTierToDb(tier);
        
        // 3.3 Récupérer la règle applicable
        const applicableRule = rules.find(r => r.tier === tierString);
        if (!applicableRule) continue;
        
        // 3.4 Calculer le montant de la commission (nombre de contrats * montant unitaire)
        const unitAmount = applicableRule.unit_amount || 0; 
        const amount = calculateCommissionAmount(contractsCount, unitAmount);
        
        if (!amount) continue; // Pas de montant à commissionner
        
        // 3.5 Créer la commission
        const { error: insertError } = await supabase
          .from("commissions")
          .insert({
            freelancerId: freelancer.id,
            amount,
            tier: tierString,
            periodStart: startDate.toISOString(),
            periodEnd: endDate.toISOString(),
            status: 'pending',
            payment_requested: false
          });
        
        if (insertError) {
          console.error(`Erreur lors de la création de la commission pour ${freelancer.name}:`, insertError);
          continue;
        }
        
        successCount++;
      } catch (error) {
        console.error(`Erreur lors du traitement du freelancer ${freelancer.name}:`, error);
      }
    }
    
    toast({
      title: "Commissions générées",
      description: `${successCount} commissions ont été générées avec succès pour ${month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}.`,
    });
    
    return successCount > 0;
  } catch (error: any) {
    console.error("Erreur lors de la génération des commissions:", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors de la génération des commissions",
    });
    return false;
  }
}
