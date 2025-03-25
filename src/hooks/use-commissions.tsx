
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Commission, CommissionRule, CommissionTier } from "@/types/commissions";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useCommissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingPayment, setRequestingPayment] = useState(false);
  const { user, isAdmin, isFreelancer } = useAuth();

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("commissions")
        .select(`
          *,
          freelancer:users(name)
        `);
      
      // Si c'est un freelancer, filter uniquement ses commissions
      if (isFreelancer && user) {
        query = query.eq("freelancerId", user.id);
      }
      
      const { data, error } = await query.order("createdAt", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const mappedCommissions: Commission[] = data.map((item) => {
        const tierValue = item.tier as string;
        const tierEnum = 
          tierValue === 'tier_1' ? CommissionTier.TIER_1 :
          tierValue === 'tier_2' ? CommissionTier.TIER_2 :
          tierValue === 'tier_3' ? CommissionTier.TIER_3 :
          tierValue === 'tier_4' ? CommissionTier.TIER_4 :
          CommissionTier.TIER_1;
          
        return {
          id: item.id,
          freelancerId: item.freelancerId,
          freelancerName: item.freelancer?.name || "Freelancer inconnu",
          amount: item.amount,
          tier: tierEnum,
          periodStart: new Date(item.periodStart),
          periodEnd: new Date(item.periodEnd),
          status: item.status,
          paidDate: item.paidDate ? new Date(item.paidDate) : undefined,
          paymentRequested: item.payment_requested || false,
        };
      });
      
      setCommissions(mappedCommissions);
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
  }, [user, isFreelancer]);

  const fetchCommissionRules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("commission_rules")
        .select("*")
        .order("minContracts", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      const mappedRules: CommissionRule[] = data.map((rule) => {
        const tierValue = rule.tier as string;
        const tierEnum = 
          tierValue === 'tier_1' ? CommissionTier.TIER_1 :
          tierValue === 'tier_2' ? CommissionTier.TIER_2 :
          tierValue === 'tier_3' ? CommissionTier.TIER_3 :
          tierValue === 'tier_4' ? CommissionTier.TIER_4 :
          CommissionTier.TIER_1;
          
        return {
          tier: tierEnum,
          minContracts: rule.minContracts,
          maxContracts: null,
          amount: rule.percentage,
        };
      });
      
      setCommissionRules(mappedRules);
    } catch (error) {
      console.error("Erreur lors du chargement des règles de commissions:", error);
    }
  }, []);

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
      // Vérifier si la commission appartient au freelancer connecté
      const { data: commission, error: commissionError } = await supabase
        .from("commissions")
        .select("freelancerId")
        .eq("id", commissionId)
        .single();
      
      if (commissionError) throw commissionError;
      
      // Si l'utilisateur n'est pas admin, vérifier qu'il est bien le propriétaire de la commission
      if (!isAdmin && commission.freelancerId !== user.id) {
        throw new Error("Vous n'êtes pas autorisé à demander le versement de cette commission");
      }
      
      const { error } = await supabase
        .from("commissions")
        .update({ payment_requested: true })
        .eq("id", commissionId);

      if (error) {
        throw error;
      }

      // Mettre à jour localement
      setCommissions(commissions.map(comm => 
        comm.id === commissionId ? { ...comm, paymentRequested: true } : comm
      ));
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de versement a été envoyée avec succès",
      });
    } catch (error: any) {
      console.error("Erreur lors de la demande de versement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande",
      });
    } finally {
      setRequestingPayment(false);
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
  };
};
