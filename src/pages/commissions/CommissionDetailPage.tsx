
import React from "react";
import { useParams } from "react-router-dom";
import { useCommissionDetail } from "@/hooks/use-commission-detail";
import CommissionDetailHeader from "@/components/commissions/CommissionDetailHeader";
import CommissionGeneralInfo from "@/components/commissions/CommissionGeneralInfo";
import CommissionActions from "@/components/commissions/CommissionActions";
import CommissionNotFound from "@/components/commissions/CommissionNotFound";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CommissionDetailPage: React.FC = () => {
  const { commissionId } = useParams<{ commissionId: string }>();
  const { commission, isLoading, requestingPayment, requestPayment } = useCommissionDetail(commissionId);
  const { isAdmin, isFreelancer, isAccountManager, user } = useAuth();

  // Si c'est un chargé d'affaires, il n'a pas accès aux commissions
  if (isAccountManager) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Détail de la commission</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès restreint</AlertTitle>
          <AlertDescription>
            En tant que chargé d'affaires, vous n'avez pas accès aux informations sur les commissions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Vérifier si le freelancer peut voir cette commission
  if (isFreelancer && commission && user && commission.freelancerId !== user.id) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Détail de la commission</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Accès restreint</AlertTitle>
          <AlertDescription>
            Vous n'avez pas accès aux informations de cette commission.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommissionDetailHeader commissionId={commissionId} loading={isLoading} />

      {!commission ? (
        <CommissionNotFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CommissionGeneralInfo commission={commission} />
          
          <CommissionActions 
            status={commission.status}
            paymentRequested={commission.paymentRequested}
            requestingPayment={requestingPayment}
            onRequestPayment={requestPayment}
            isAdmin={isAdmin}
            commission={commission}
          />
        </div>
      )}
    </div>
  );
};

export default CommissionDetailPage;
