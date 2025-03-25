
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { toast } from "@/components/ui/use-toast";
import { CommissionTier } from "@/types";

interface Commission {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  tier: CommissionTier;
  period: {
    startDate: Date;
    endDate: Date;
  };
  status: string;
  paidDate?: Date;
  paymentRequested?: boolean;
}

export const useCommissions = () => {
  const { supabaseClient } = useSupabase();
  const [requestingPayment, setRequestingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  
  // Commission rules could be fetched from the database in a real app
  const [commissionRules] = useState([
    {
      tier: CommissionTier.TIER_1,
      minContracts: 0,
      maxContracts: 10,
      amount: 500,
    },
    {
      tier: CommissionTier.TIER_2,
      minContracts: 11,
      maxContracts: 20,
      amount: 1000,
    },
    {
      tier: CommissionTier.TIER_3,
      minContracts: 21,
      maxContracts: 30,
      amount: 1500,
    },
    {
      tier: CommissionTier.TIER_4,
      minContracts: 31,
      maxContracts: null,
      amount: 2000,
    },
  ]);

  useEffect(() => {
    fetchCommissions();
  }, [supabaseClient]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      
      // Récupérer les commissions
      const { data: commissionsData, error: commissionsError } = await supabaseClient
        .from("commissions")
        .select("*")
        .order("periodStart", { ascending: false });

      if (commissionsError) {
        throw commissionsError;
      }

      // Récupérer tous les freelancers concernés
      const freelancerIds = [...new Set(commissionsData.map(c => c.freelancerId))];
      
      const { data: freelancersData, error: freelancersError } = await supabaseClient
        .from("users")
        .select("id, name")
        .in("id", freelancerIds);

      if (freelancersError) {
        console.error("Erreur lors de la récupération des freelancers:", freelancersError);
      }

      // Mapper les données avec conversion de tier string vers CommissionTier enum
      const mappedCommissions: Commission[] = commissionsData.map(commission => {
        const freelancer = freelancersData?.find(f => f.id === commission.freelancerId);
        
        // Conversion de string à CommissionTier
        const tierValue = commission.tier as string;
        const tierEnum: CommissionTier = 
          tierValue === 'tier_1' ? CommissionTier.TIER_1 :
          tierValue === 'tier_2' ? CommissionTier.TIER_2 :
          tierValue === 'tier_3' ? CommissionTier.TIER_3 :
          tierValue === 'tier_4' ? CommissionTier.TIER_4 :
          CommissionTier.TIER_1; // Valeur par défaut
        
        return {
          id: commission.id,
          freelancerId: commission.freelancerId,
          freelancerName: freelancer?.name || "Freelancer inconnu",
          amount: commission.amount,
          tier: tierEnum,
          period: {
            startDate: new Date(commission.periodStart),
            endDate: new Date(commission.periodEnd),
          },
          status: commission.status,
          paidDate: commission.paidDate ? new Date(commission.paidDate) : undefined,
          paymentRequested: commission.payment_requested,
        };
      });

      setCommissions(mappedCommissions);
    } catch (error) {
      console.error("Erreur lors de la récupération des commissions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les commissions.",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestPayment = async (commissionId: string) => {
    setRequestingPayment(true);
    try {
      const { error } = await supabaseClient
        .from("commissions")
        .update({ payment_requested: true })
        .eq("id", commissionId);

      if (error) {
        throw error;
      }
      
      // Mettre à jour l'UI
      setCommissions(prevCommissions => 
        prevCommissions.map(commission => 
          commission.id === commissionId 
            ? { ...commission, paymentRequested: true } 
            : commission
        )
      );
      
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
    commissions,
    commissionRules,
    loading,
    requestingPayment,
    requestPayment,
  };
};

export type { Commission };
