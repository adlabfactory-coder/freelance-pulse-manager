
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { CommissionTier } from "@/types";
import { toast } from "@/components/ui/use-toast";

export interface CommissionDetail {
  id: string;
  freelancerId: string;
  freelancerName?: string;
  amount: number;
  tier: CommissionTier;
  periodStart: Date;
  periodEnd: Date;
  status: string;
  paidDate?: Date;
  payment_requested: boolean;
  createdAt: Date;
}

export const useCommissionDetail = (commissionId: string | undefined) => {
  const { supabaseClient } = useSupabase();
  const [commission, setCommission] = useState<CommissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingPayment, setRequestingPayment] = useState(false);

  useEffect(() => {
    fetchCommissionDetails();
  }, [commissionId, supabaseClient]);

  const fetchCommissionDetails = async () => {
    try {
      setLoading(true);
      
      if (!commissionId) return;

      const { data: commissionData, error: commissionError } = await supabaseClient
        .from("commissions")
        .select("*")
        .eq("id", commissionId)
        .single();

      if (commissionError) {
        throw commissionError;
      }

      if (commissionData) {
        // Récupérer les informations du freelancer
        const { data: freelancerData, error: freelancerError } = await supabaseClient
          .from("users")
          .select("name")
          .eq("id", commissionData.freelancerId)
          .single();

        if (freelancerError) {
          console.error("Erreur lors de la récupération du freelancer:", freelancerError);
        }

        // Conversion de string à CommissionTier pour la propriété tier
        const tierValue = commissionData.tier as string;
        const tierEnum: CommissionTier = 
          tierValue === 'tier_1' ? CommissionTier.TIER_1 :
          tierValue === 'tier_2' ? CommissionTier.TIER_2 :
          tierValue === 'tier_3' ? CommissionTier.TIER_3 :
          tierValue === 'tier_4' ? CommissionTier.TIER_4 :
          CommissionTier.TIER_1; // Valeur par défaut

        // Conversion des dates
        const commission: CommissionDetail = {
          ...commissionData,
          freelancerName: freelancerData?.name || "Freelancer inconnu",
          tier: tierEnum,
          periodStart: new Date(commissionData.periodStart),
          periodEnd: new Date(commissionData.periodEnd),
          createdAt: new Date(commissionData.createdAt),
          paidDate: commissionData.paidDate ? new Date(commissionData.paidDate) : undefined,
          payment_requested: commissionData.payment_requested || false,
        };

        setCommission(commission);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la commission:", error);
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
    if (!commission || !commissionId) return;

    setRequestingPayment(true);
    try {
      const { error } = await supabaseClient
        .from("commissions")
        .update({ payment_requested: true })
        .eq("id", commissionId);

      if (error) {
        throw error;
      }

      setCommission(prev => prev ? { ...prev, payment_requested: true } : null);

      toast({
        title: "Demande envoyée",
        description: "Votre demande de versement a été envoyée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la demande de versement:", error);
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
    requestPayment
  };
};
