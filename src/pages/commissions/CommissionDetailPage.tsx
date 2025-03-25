
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, DollarSign, User, FileText } from "lucide-react";
import { CommissionTier } from "@/types";
import { formatCurrency, formatPeriod } from "@/utils/commission";
import { toast } from "@/components/ui/use-toast";

interface Commission {
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

const CommissionDetailPage: React.FC = () => {
  const { commissionId } = useParams<{ commissionId: string }>();
  const navigate = useNavigate();
  const { supabaseClient } = useSupabase();
  const [commission, setCommission] = useState<Commission | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingPayment, setRequestingPayment] = useState(false);

  useEffect(() => {
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
          const commission: Commission = {
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

    fetchCommissionDetails();
  }, [commissionId, supabaseClient]);

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

  const getTierLabel = (tier: CommissionTier): string => {
    switch (tier) {
      case CommissionTier.TIER_1:
        return "Palier 1";
      case CommissionTier.TIER_2:
        return "Palier 2";
      case CommissionTier.TIER_3:
        return "Palier 3";
      case CommissionTier.TIER_4:
        return "Palier 4";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string, paymentRequested: boolean): string => {
    switch (status) {
      case "paid":
        return "Payé";
      case "pending":
        return paymentRequested ? "Demande envoyée" : "En attente";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/commissions")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Commission introuvable</h1>
        </div>
        <p className="text-muted-foreground">
          La commission que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate("/commissions")}>Retour aux commissions</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/commissions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Commission {commission.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Référence</p>
                <p className="font-medium">{commission.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Statut</p>
                <div className="flex items-center">
                  <span 
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset
                      ${commission.status === 'paid' 
                        ? 'bg-green-50 text-green-700 ring-green-700/10' 
                        : commission.payment_requested 
                          ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
                          : 'bg-yellow-50 text-yellow-700 ring-yellow-700/10'
                      }`
                    }>
                    {getStatusLabel(commission.status, commission.payment_requested)}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Commercial</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{commission.freelancerName}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Montant</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-green-600">{formatCurrency(commission.amount)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Palier</p>
                <p className="font-medium">{getTierLabel(commission.tier as CommissionTier)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date de paiement</p>
                <p className="font-medium">
                  {commission.paidDate ? commission.paidDate.toLocaleDateString() : "-"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Période</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">
                  {formatPeriod(commission.periodStart, commission.periodEnd)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date de création</p>
              <p className="font-medium">
                {commission.createdAt.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {commission.status === "pending" && !commission.payment_requested ? (
              <Button 
                className="w-full" 
                onClick={requestPayment}
                disabled={requestingPayment}
              >
                Demander le versement
              </Button>
            ) : null}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/commissions")}
            >
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommissionDetailPage;
