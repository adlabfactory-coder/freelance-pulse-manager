
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
      const data = await commissionsService.fetchCommissions(user.id, role);
      setCommissions(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commissions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les commissions",
      });
    } finally {
      setLoading(false);
    }
  }, [user, role, commissionsService]);

  const fetchCommissionRules = useCallback(async () => {
    try {
      const data = await commissionsService.fetchCommissionRules();
      setCommissionRules(data);
    } catch (error) {
      console.error("Erreur lors du chargement des règles de commissions:", error);
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
      }
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
      }
    } catch (error) {
      console.error("Erreur lors de la validation du paiement:", error);
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
      // Recharger les commissions après la génération
      fetchCommissions();
    } catch (error) {
      console.error("Erreur lors de la génération des commissions:", error);
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
    requestPayment,
    approvePayment,
    generateMonthlyCommissions,
  };
};
