
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/use-supabase";
import { CommissionTier } from "@/types";
import CommissionTiers from "@/components/commissions/CommissionTiers";
import CommissionsTable from "@/components/commissions/CommissionsTable";
import CommissionToolbar from "@/components/commissions/CommissionToolbar";
import CommissionStatusBadge from "@/components/commissions/CommissionStatusBadge";
import { getTierLabel, formatCurrency, formatPeriod } from "@/utils/commission";

const Commissions: React.FC = () => {
  const supabase = useSupabase();
  const [requestingPayment, setRequestingPayment] = useState(false);
  
  const commissions = [
    {
      id: "C-2023-001",
      freelancerName: "John Doe",
      amount: 500,
      tier: CommissionTier.TIER_1,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "paid",
      paidDate: new Date(2023, 5, 5),
    },
    {
      id: "C-2023-002",
      freelancerName: "Jane Smith",
      amount: 1000,
      tier: CommissionTier.TIER_2,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "paid",
      paidDate: new Date(2023, 5, 5),
    },
    {
      id: "C-2023-003",
      freelancerName: "Mike Johnson",
      amount: 1500,
      tier: CommissionTier.TIER_3,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "pending",
      paymentRequested: true,
    },
    {
      id: "C-2023-004",
      freelancerName: "Sarah Wilson",
      amount: 2000,
      tier: CommissionTier.TIER_4,
      period: {
        startDate: new Date(2023, 4, 1),
        endDate: new Date(2023, 4, 31),
      },
      status: "pending",
      paymentRequested: false,
    },
    {
      id: "C-2023-005",
      freelancerName: "John Doe",
      amount: 500,
      tier: CommissionTier.TIER_1,
      period: {
        startDate: new Date(2023, 3, 1),
        endDate: new Date(2023, 3, 30),
      },
      status: "paid",
      paidDate: new Date(2023, 4, 5),
    },
  ];

  const commissionRules = [
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
  ];

  const getStatusBadge = (status: string, paymentRequested: boolean = false) => {
    return <CommissionStatusBadge status={status} paymentRequested={paymentRequested} />;
  };
  
  const requestPayment = async (commissionId: string) => {
    setRequestingPayment(true);
    try {
      // Simulation d'une requête vers Supabase pour demander le paiement
      // Dans un cas réel, nous mettrions à jour la base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de versement a été envoyée avec succès.",
      });
      
      // Mise à jour de l'UI en attendant une vraie implémentation
      // Dans une implémentation réelle, nous ferions un refetch des données
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

      <CommissionsTable 
        commissions={commissions}
        requestingPayment={requestingPayment}
        requestPayment={requestPayment}
        getTierLabel={getTierLabel}
        getStatusBadge={getStatusBadge}
        formatCurrency={formatCurrency}
        formatPeriod={formatPeriod}
      />
    </div>
  );
};

export default Commissions;
