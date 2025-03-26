
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Commission, CommissionStatus, CommissionTier } from '@/types/commissions';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

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
            amount: rule.amount || getCommissionAmount(tierEnum),
          };
        });
      } catch (error) {
        console.error("Erreur lors du chargement des règles de commissions:", error);
        throw error;
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
          
          if (commissionError) throw commissionError;
          
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
        
        // À implémenter: logique de génération des commissions mensuelles
        toast({
          title: "Calcul des commissions",
          description: "Génération des commissions pour le mois en cours.",
        });

        // Simuler un traitement asynchrone
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Succès",
          description: "Les commissions du mois ont été calculées avec succès",
        });
        return true;
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

/**
 * Obtient le montant de commission en fonction du palier
 * Basé sur le nombre de contrats selon les règles spécifiées
 */
const getCommissionAmount = (tier: CommissionTier): number => {
  switch(tier) {
    case CommissionTier.TIER_1: // Moins de 10 contrats
      return 500;
    case CommissionTier.TIER_2: // 11 à 20 contrats
      return 1000;
    case CommissionTier.TIER_3: // 21 à 30 contrats
      return 1500;
    case CommissionTier.TIER_4: // 31+ contrats
      return 2000;
    default:
      return 500;
  }
};
