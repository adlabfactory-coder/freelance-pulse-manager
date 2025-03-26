
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";
import { Commission, CommissionStatus, CommissionTier } from "@/types/commissions";

// Define an extended type for commission detail which includes additional fields
export interface CommissionDetail extends Omit<Commission, 'period'> {
  periodStart: Date;
  periodEnd: Date;
  paymentRequested: boolean;
  createdAt: Date;
}

export const useCommissionDetail = (commissionId: string | undefined) => {
  const { supabaseClient } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [commission, setCommission] = useState<CommissionDetail | null>(null);
  const [requestingPayment, setRequestingPayment] = useState(false);

  useEffect(() => {
    if (commissionId) {
      fetchCommissionDetail(commissionId);
    } else {
      setLoading(false);
    }
  }, [commissionId, supabaseClient]);

  const fetchCommissionDetail = async (id: string) => {
    try {
      setLoading(true);

      // Fetch the commission
      const { data: commissionData, error: commissionError } = await supabaseClient
        .from("commissions")
        .select("*")
        .eq("id", id)
        .single();

      if (commissionError) {
        throw commissionError;
      }

      // Fetch the freelancer
      const { data: freelancer, error: freelancerError } = await supabaseClient
        .from("users")
        .select("name")
        .eq("id", commissionData.freelancerId)
        .single();

      if (freelancerError) {
        console.error("Error fetching freelancer:", freelancerError);
      }

      // Map the data
      let tierEnum: CommissionTier;
      
      switch(commissionData.tier) {
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

      const mappedCommission: CommissionDetail = {
        id: commissionData.id,
        freelancerId: commissionData.freelancerId,
        freelancerName: freelancer?.name || "Freelancer inconnu",
        amount: commissionData.amount,
        tier: tierEnum,
        periodStart: new Date(commissionData.periodStart),
        periodEnd: new Date(commissionData.periodEnd),
        status: commissionData.status as CommissionStatus,
        paidDate: commissionData.paidDate ? new Date(commissionData.paidDate) : undefined,
        paymentRequested: commissionData.payment_requested || false,
        createdAt: new Date(commissionData.createdAt || Date.now()),
      };

      setCommission(mappedCommission);
    } catch (error) {
      console.error("Error fetching commission detail:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les détails de la commission.",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestPayment = async () => {
    if (!commissionId) return;
    
    setRequestingPayment(true);
    try {
      const { error } = await supabaseClient
        .from("commissions")
        .update({ payment_requested: true })
        .eq("id", commissionId);

      if (error) {
        throw error;
      }

      // Update UI
      setCommission(prev => prev ? { ...prev, paymentRequested: true } : null);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de versement a été envoyée avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande.",
      });
    } finally {
      setRequestingPayment(false);
    }
  };

  return {
    commission,
    loading,
    requestingPayment,
    requestPayment,
  };
};

export type { Commission };
