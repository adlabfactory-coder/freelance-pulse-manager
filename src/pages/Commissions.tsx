
import React from "react";
import { useCommissions } from "@/hooks/use-commissions";
import FreelancerCommissionsList from "@/components/commissions/FreelancerCommissionsList";
import { useAuth } from "@/hooks/use-auth";
import AdminCommissionsContent from "@/components/commissions/AdminCommissionsContent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Commissions: React.FC = () => {
  const { isAdmin, isFreelancer, isAccountManager } = useAuth();
  const { 
    commissions, 
    commissionRules, 
    loading, 
    requestingPayment, 
    requestPayment,
    approvePayment,
    generateMonthlyCommissions
  } = useCommissions();

  // Si c'est un chargé d'affaires, afficher un message d'accès restreint
  if (isAccountManager) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Commissions</h1>
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

  // Si c'est un freelancer, afficher la vue freelancer
  if (isFreelancer) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Mes Commissions</h1>
        <FreelancerCommissionsList />
      </div>
    );
  }

  // Sinon, afficher la vue admin
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Gestion des Commissions</h1>
      <AdminCommissionsContent 
        commissions={commissions}
        commissionRules={commissionRules}
        loading={loading}
        requestingPayment={requestingPayment}
        requestPayment={requestPayment}
        approvePayment={approvePayment}
        generateMonthlyCommissions={generateMonthlyCommissions}
      />
    </div>
  );
};

export default Commissions;
