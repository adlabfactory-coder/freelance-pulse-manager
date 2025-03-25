
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/use-supabase";
import { CommissionTier } from "@/types";
import { useNavigate } from "react-router-dom";
import CommissionTiers from "@/components/commissions/CommissionTiers";
import CommissionsTable from "@/components/commissions/CommissionsTable";
import CommissionToolbar from "@/components/commissions/CommissionToolbar";
import CommissionStatusBadge from "@/components/commissions/CommissionStatusBadge";
import { getTierLabel, formatCurrency, formatPeriod } from "@/utils/commission";

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

const Commissions: React.FC = () => {
  const { supabaseClient } = useSupabase();
  const navigate = useNavigate();
  const [requestingPayment, setRequestingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [commissionRules, setCommissionRules] = useState([
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

        // Mapper les données
        const mappedCommissions: Commission[] = commissionsData.map(commission => {
          const freelancer = freelancersData?.find(f => f.id === commission.freelancerId);
          
          return {
            id: commission.id,
            freelancerId: commission.freelancerId,
            freelancerName: freelancer?.name || "Freelancer inconnu",
            amount: commission.amount,
            tier: commission.tier as CommissionTier,
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

    fetchCommissions();
  }, [supabaseClient]);

  const getStatusBadge = (status: string, paymentRequested: boolean = false) => {
    return <CommissionStatusBadge status={status} paymentRequested={paymentRequested} />;
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
  
  const handleViewCommission = (commissionId: string) => {
    navigate(`/commissions/detail/${commissionId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les commissions des commerciaux
        </p>
      </div>

      <CommissionTiers 
        commissionRules={commissionRules} 
        formatCurrency={formatCurrency} 
        getTierLabel={getTierLabel} 
      />

      <CommissionToolbar />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune commission disponible</p>
        </div>
      ) : (
        <CommissionsTable 
          commissions={commissions}
          requestingPayment={requestingPayment}
          requestPayment={requestPayment}
          getTierLabel={getTierLabel}
          getStatusBadge={getStatusBadge}
          formatCurrency={formatCurrency}
          formatPeriod={formatPeriod}
          onViewCommission={handleViewCommission}
        />
      )}
    </div>
  );
};

export default Commissions;
