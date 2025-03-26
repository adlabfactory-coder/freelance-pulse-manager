
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Commission, CommissionStatus, CommissionTier } from '@/types/commissions';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { determineCommissionTier, calculateCommissionAmount } from '@/utils/commission';

export const createCommissionsService = (supabase: SupabaseClient<Database>) => {
  return {
    /**
     * Récupère les commissions selon le rôle de l'utilisateur
     * - Admin: toutes les commissions
     * - Freelance: uniquement ses commissions
     * - Autres: aucune commission
     */
    fetchCommissions: async (userId: string, userRole: UserRole): Promise<Commission[]> => {
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
        
        return data.map((item) => {
          let tierEnum: CommissionTier;
          
          switch(item.tier) {
            case 'bronze':
              tierEnum = CommissionTier.TIER_1;
              break;
            case 'silver':
              tierEnum = CommissionTier.TIER_2;
              break;
            case 'gold':
              tierEnum = CommissionTier.TIER_3;
              break;
            case 'platinum':
              tierEnum = CommissionTier.TIER_4;
              break;
            default:
              tierEnum = CommissionTier.TIER_1;
          }
            
          return {
            id: item.id,
            freelancerId: item.freelancerId,
            freelancerName: item.freelancer?.name || "Freelancer inconnu",
            amount: item.amount,
            tier: tierEnum,
            periodStart: new Date(item.periodStart),
            periodEnd: new Date(item.periodEnd),
            status: item.status as CommissionStatus,
            paidDate: item.paidDate ? new Date(item.paidDate) : undefined,
            paymentRequested: item.payment_requested || false,
            period: `${new Date(item.periodStart).toLocaleDateString()} - ${new Date(item.periodEnd).toLocaleDateString()}`
          };
        });
      } catch (error) {
        console.error("Erreur lors du chargement des commissions:", error);
        throw error;
      }
    },

    /**
     * Récupère les règles de commission
     */
    fetchCommissionRules: async (): Promise<any[]> => {
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
          return [
            {
              id: "default-tier-1",
              tier: CommissionTier.TIER_1,
              minContracts: 0,
              percentage: 10,
              amount: 500
            },
            {
              id: "default-tier-2",
              tier: CommissionTier.TIER_2,
              minContracts: 11,
              maxContracts: 20,
              percentage: 15,
              amount: 1000
            },
            {
              id: "default-tier-3",
              tier: CommissionTier.TIER_3,
              minContracts: 21,
              maxContracts: 30,
              percentage: 20,
              amount: 1500
            },
            {
              id: "default-tier-4",
              tier: CommissionTier.TIER_4,
              minContracts: 31,
              percentage: 25,
              amount: 2000
            }
          ];
        }
        
        return data.map((rule) => {
          let tierEnum: CommissionTier;
          
          switch(rule.tier) {
            case 'bronze':
              tierEnum = CommissionTier.TIER_1;
              break;
            case 'silver':
              tierEnum = CommissionTier.TIER_2;
              break;
            case 'gold':
              tierEnum = CommissionTier.TIER_3;
              break;
            case 'platinum':
              tierEnum = CommissionTier.TIER_4;
              break;
            default:
              tierEnum = CommissionTier.TIER_1;
          }
            
          return {
            id: rule.id,
            tier: tierEnum,
            minContracts: rule.minContracts,
            maxContracts: rule.maxContracts || null,
            percentage: rule.percentage,
            amount: rule.amount || null,
          };
        });
      } catch (error) {
        console.error("Erreur lors du chargement des règles de commissions:", error);
        // Retourner des valeurs par défaut en cas d'erreur
        return [
          {
            id: "default-error-tier-1",
            tier: CommissionTier.TIER_1,
            minContracts: 0,
            percentage: 10,
            amount: 500
          },
          {
            id: "default-error-tier-2",
            tier: CommissionTier.TIER_2,
            minContracts: 11,
            percentage: 15,
            amount: 1000
          }
        ];
      }
    },

    /**
     * Demande le paiement d'une commission
     * Seul un freelancer peut demander le paiement de sa propre commission
     */
    requestPayment: async (commissionId: string, userId: string, userRole: UserRole): Promise<boolean> => {
      try {
        // Vérifier si l'utilisateur a le droit de demander un paiement
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.FREELANCER) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'êtes pas autorisé à demander un versement",
          });
          return false;
        }
        
        // Vérifier si la commission appartient au freelancer connecté
        if (userRole === UserRole.FREELANCER) {
          const { data: commission, error: commissionError } = await supabase
            .from("commissions")
            .select("freelancerId")
            .eq("id", commissionId)
            .single();
          
          if (commissionError) {
            console.error("Erreur lors de la vérification de la commission:", commissionError);
            throw new Error("Impossible de vérifier les détails de la commission");
          }
          
          // Vérifier que le freelancer est bien le propriétaire
          if (commission.freelancerId !== userId) {
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous n'êtes pas autorisé à demander le versement de cette commission",
            });
            return false;
          }
        }
        
        const { error } = await supabase
          .from("commissions")
          .update({ payment_requested: true })
          .eq("id", commissionId);

        if (error) {
          throw error;
        }
        
        toast({
          title: "Demande envoyée",
          description: "Votre demande de versement a été envoyée avec succès",
        });
        return true;
      } catch (error: any) {
        console.error("Erreur lors de la demande de versement:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'envoi de votre demande",
        });
        return false;
      }
    },

    /**
     * Valide le paiement d'une commission
     * Seul un administrateur peut effectuer cette action
     */
    approvePayment: async (commissionId: string, userRole: UserRole): Promise<boolean> => {
      try {
        // Vérifier si l'utilisateur a le droit d'approuver un paiement
        if (userRole !== UserRole.ADMIN) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Seul un administrateur peut valider les versements",
          });
          return false;
        }
        
        const { error } = await supabase
          .from("commissions")
          .update({ 
            status: 'paid',
            paidDate: new Date().toISOString()
          })
          .eq("id", commissionId);

        if (error) {
          throw error;
        }
        
        toast({
          title: "Paiement validé",
          description: "Le versement a été marqué comme effectué",
        });
        return true;
      } catch (error: any) {
        console.error("Erreur lors de la validation du paiement:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de la validation du paiement",
        });
        return false;
      }
    },

    /**
     * Génère automatiquement les commissions pour un mois donné
     * Fonction réservée aux administrateurs
     */
    generateMonthlyCommissions: async (month: Date, userRole: UserRole): Promise<boolean> => {
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
            // 3.1 Compter le nombre de contrats signés pendant le mois
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
            
            // 3.2 Déterminer le palier applicable
            const tier = determineCommissionTier(contractsCount, rules);
            let tierString = 'bronze';
            switch (tier) {
              case CommissionTier.TIER_2:
                tierString = 'silver';
                break;
              case CommissionTier.TIER_3:
                tierString = 'gold';
                break;
              case CommissionTier.TIER_4:
                tierString = 'platinum';
                break;
            }
            
            // 3.3 Calculer le montant de la commission
            const applicableRule = rules.find(r => r.tier === tierString);
            if (!applicableRule) continue;
            
            // Montant fixe ou pourcentage du chiffre d'affaires
            let amount = applicableRule.amount;
            
            if (!amount && applicableRule.percentage) {
              // Calculer le chiffre d'affaires total du mois
              const { data: quotes, error: quotesTotalError } = await supabase
                .from("quotes")
                .select("totalAmount")
                .eq("freelancerId", freelancer.id)
                .eq("status", "approved")
                .gte("createdAt", startDate.toISOString())
                .lte("createdAt", endDate.toISOString());
              
              if (quotesTotalError) {
                console.error(`Erreur lors du calcul du chiffre d'affaires pour ${freelancer.name}:`, quotesTotalError);
                continue;
              }
              
              const totalRevenue = quotes.reduce((sum, quote) => sum + (quote.totalAmount || 0), 0);
              amount = calculateCommissionAmount(totalRevenue, applicableRule.percentage);
            }
            
            if (!amount) continue; // Pas de montant à commissionner
            
            // 3.4 Créer la commission
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
  };
};
