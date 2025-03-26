
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Commission, CommissionRule, CommissionStatus, CommissionTier } from "@/types/commissions";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createCommissionsService } from "@/services/supabase/commissions";

export const useCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingPayment, setRequestingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin, isFreelancer, role } = useAuth();
  
  const commissionsService = createCommissionsService(supabase as any);

  const fetchCommissions = useCallback(async () => {
    if (!user) {
      setCommissions([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await commissionsService.fetchCommissions(user.id, role);
      setCommissions(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des commissions:", error);
      setError("Impossible de récupérer les commissions. Veuillez réessayer plus tard.");
      
      // Simuler des données pour l'interface utilisateur en cas d'erreur
      if (isFreelancer) {
        setCommissions([
          {
            id: "offline-commission-1",
            freelancerId: user.id,
            freelancerName: user.name || "Freelancer",
            amount: 1200,
            tier: CommissionTier.TIER_2,
            periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
            status: "pending" as CommissionStatus,
            paymentRequested: false,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          }
        ]);
      } else if (isAdmin) {
        setCommissions([
          {
            id: "offline-commission-admin-1",
            freelancerId: "offline-user-1",
            freelancerName: "John Doe (Hors ligne)",
            amount: 950,
            tier: CommissionTier.TIER_1,
            periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
            status: "pending" as CommissionStatus,
            paymentRequested: true,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          },
          {
            id: "offline-commission-admin-2",
            freelancerId: "offline-user-2",
            freelancerName: "Jane Smith (Hors ligne)",
            amount: 1800,
            tier: CommissionTier.TIER_3,
            periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0),
            status: "paid" as CommissionStatus,
            paidDate: new Date(),
            paymentRequested: true,
            period: `${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString()} - ${new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toLocaleDateString()}`
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, role, commissionsService, isFreelancer, isAdmin]);

  const fetchCommissionRules = useCallback(async () => {
    try {
      setError(null);
      const data = await commissionsService.fetchCommissionRules();
      setCommissionRules(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des règles de commissions:", error);
      setError("Impossible de récupérer les règles de commission.");
      
      // Utiliser des règles par défaut en cas d'erreur
      setCommissionRules([
        {
          id: "default-tier-1",
          tier: CommissionTier.TIER_1,
          minContracts: 1,
          maxContracts: 10,
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
      ]);
    }
  }, [commissionsService]);

  const requestPayment = async (commissionId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour demander un versement",
      });
      return;
    }
    
    setRequestingPayment(true);
    try {
      const success = await commissionsService.requestPayment(commissionId, user.id, role);
      
      if (success) {
        // Mettre à jour localement
        setCommissions(commissions.map(comm => 
          comm.id === commissionId ? { ...comm, paymentRequested: true } : comm
        ));
        
        toast({
          title: "Demande envoyée",
          description: "Votre demande de versement a été envoyée avec succès",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de soumettre votre demande. Veuillez réessayer plus tard.",
      });
    } finally {
      setRequestingPayment(false);
    }
  };

  const approvePayment = async (commissionId: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un administrateur peut valider les versements",
      });
      return;
    }
    
    try {
      const success = await commissionsService.approvePayment(commissionId, role);
      
      if (success) {
        // Mettre à jour localement
        setCommissions(commissions.map(comm => 
          comm.id === commissionId ? { 
            ...comm, 
            status: 'paid' as CommissionStatus,
            paidDate: new Date()
          } : comm
        ));
        
        toast({
          title: "Paiement validé",
          description: "Le versement a été marqué comme effectué",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la validation du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de valider le paiement. Veuillez réessayer plus tard.",
      });
    }
  };

  const generateMonthlyCommissions = async (month: Date) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un administrateur peut générer les commissions mensuelles",
      });
      return;
    }
    
    try {
      await commissionsService.generateMonthlyCommissions(month, role);
      toast({
        title: "Génération en cours",
        description: "Les commissions sont en cours de génération. Veuillez rafraîchir la page dans quelques instants."
      });
      // Recharger les commissions après la génération
      setTimeout(() => fetchCommissions(), 3000);
    } catch (error) {
      console.error("Erreur lors de la génération des commissions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer les commissions. Veuillez réessayer plus tard.",
      });
    }
  };

  useEffect(() => {
    fetchCommissions();
    fetchCommissionRules();
  }, [fetchCommissions, fetchCommissionRules]);

  return {
    commissions,
    commissionRules,
    loading,
    requestingPayment,
    error,
    requestPayment,
    approvePayment,
    generateMonthlyCommissions,
  };
};
